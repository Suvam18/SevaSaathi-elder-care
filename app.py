from flask import Flask, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
app.secret_key = 'sevasaathi_super_secret_key_development'  # For dev purposes only

# In-memory "database" for development {"email": {"password": "hashed", "name": "User Name"}}
users_db = {}

@app.route('/')
def index():
    user_name = None
    if 'user_email' in session and session['user_email'] in users_db:
        user_name = users_db[session['user_email']]['name']
    return render_template('index.html', user_name=user_name)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        if email in users_db and check_password_hash(users_db[email]['password'], password):
            session['user_email'] = email
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid email or password.', 'error')
            
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        
        if not name or not email or not password:
            flash('Please fill out all fields.', 'error')
        elif email in users_db:
            flash('Email already exists. Please log in.', 'error')
        else:
            users_db[email] = {
                'password': generate_password_hash(password),
                'name': name
            }
            flash('Account created successfully! Please log in.', 'success')
            return redirect(url_for('login'))
            
    return render_template('signup.html')

@app.route('/dashboard')
def dashboard():
    if 'user_email' not in session:
        flash('Please login to access the dashboard.', 'error')
        return redirect(url_for('login'))
        
    user_name = users_db[session['user_email']]['name']
    return render_template('dashboard.html', email=session['user_email'], user_name=user_name)

@app.route('/profile')
def profile():
    if 'user_email' not in session:
        flash('Please login to access your profile.', 'error')
        return redirect(url_for('login'))
        
    user_name = users_db[session['user_email']]['name']
    return render_template('profile.html', email=session['user_email'], user_name=user_name)

@app.route('/logout')
def logout():
    session.pop('user_email', None)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
