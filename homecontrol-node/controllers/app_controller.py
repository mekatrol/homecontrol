import atexit
from time import sleep
import threading

from dataclasses import asdict
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from wireup import container

from services.user_service import ForbiddenException

app_bp = Blueprint('app', __name__)

# This controls the background task running state
background_tasks_thread_event = threading.Event()


def background_task():
    while background_tasks_thread_event.is_set():
        print('Background task tick...')
        sleep(5)


def stop_background_task():
    try:
        background_tasks_thread_event.clear()

        print("Background task stopped!")
    except Exception as error:
        print(str(error))


def start_background_task():
    try:
        atexit.register(stop_background_task)

        background_tasks_thread_event.set()

        thread = threading.Thread(target=background_task)
        thread.start()

        return None
    except Exception as error:
        return str(error)


@app_bp.get('/start')
@jwt_required()
@container.autowire
def start_app():
    try:
        # Start background task
        start_background_task()

        return jsonify({
            "message": "Background task started"
        }), 200
    except ForbiddenException:
        return jsonify({
            "message": "you are not permitted"
        }), 403


@app_bp.get('/stop')
@jwt_required()
@container.autowire
def stop_app():
    try:
        # Stop background task
        stop_background_task()

        return jsonify({
            "message": "Background task stopped"
        }), 200
    except ForbiddenException:
        return jsonify({
            "message": "you are not permitted"
        }), 403


@app_bp.get('/ping')
def ping():
    return jsonify({"ping": "pong"}), 200
