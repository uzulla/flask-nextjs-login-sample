import os
from datetime import timedelta
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=1)
app.config['SESSION_COOKIE_SAMESITE'] = None  # Changed from 'Lax' to None for development
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_PATH'] = '/'
app.config['SESSION_COOKIE_DOMAIN'] = None

# Initialize extensions
CORS(app,
     resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:3001"]}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     expose_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "OPTIONS"])
sess = Session(app)
db.init_app(app)

# Initialize database and create default user
with app.app_context():
    db.create_all()
    # Create a default user if none exists
    if User.query.count() == 0:
        default_user = User(
            username='admin',
            password_hash=generate_password_hash('password')
        )
        db.session.add(default_user)
        db.session.commit()

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if username already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"msg": "Username already exists"}), 409
    
    # Create new user
    new_user = User(
        username=data['username'],
        password_hash=generate_password_hash(data['password'])
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"msg": "User created successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({"msg": "Invalid credentials"}), 401
    
    # Store user info in session
    session['user_id'] = user.id
    session['username'] = user.username
    session.modified = True  # Ensure the session is saved
    
    return jsonify({
        "msg": "Login successful",
        "user": {
            "id": user.id,
            "username": user.username
        }
    }), 200

@app.route('/api/logout', methods=['POST'])
def logout():
    # Clear the session
    session.clear()
    session.modified = True  # Ensure the session is saved
    return jsonify({"msg": "Logout successful"}), 200

@app.route('/api/user', methods=['GET'])
def get_user():
    # Check if user is logged in
    if 'user_id' not in session:
        return jsonify({"msg": "Unauthorized"}), 401
    
    user_id = session['user_id']
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    return jsonify({
        "id": user.id,
        "username": user.username
    }), 200

@app.route('/api/protected', methods=['GET'])
def protected():
    # Check if user is logged in
    if 'user_id' not in session:
        return jsonify({"msg": "Unauthorized"}), 401
    
    user_id = session['user_id']
    return jsonify({"msg": "Access granted to protected resource", "user_id": user_id}), 200

@app.route('/api/session-debug', methods=['GET'])
def session_debug():
    # Return all session data for debugging
    return jsonify({
        "session": dict(session),
        "cookies": dict(request.cookies)
    }), 200

if __name__ == '__main__':
    app.run(debug=True)
