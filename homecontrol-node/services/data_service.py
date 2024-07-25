from dataclasses import dataclass
from typing import Annotated
from pysondb import db
from wireup import Inject, service
from models.config import DataFileConfig
from services.base import BaseService


@service
class DataService(BaseService):
    users_db: db.JsonDatabase
    user_revoked_tokens_db: db.JsonDatabase
    user_security_roles_db: db.JsonDatabase
    points_db: db.JsonDatabase

    def __init__(self, data_files: Annotated[DataFileConfig, Inject(param="data_files")]):
        super().__init__()

        users_data_file = data_files.get("users_data_file")
        user_revoked_tokens_data_file = data_files.get(
            "user_revoked_tokens_data_file")
        user_security_roles_data_file = data_files.get(
            "user_security_roles_data_file")
        points_data_file = data_files.get("points_data_file")

        if users_data_file is None:
            raise Exception(
                "'users_data_file' setting missing from configuration file")

        if user_revoked_tokens_data_file is None:
            raise Exception(
                "'user_revoked_tokens_data_file' setting missing from configuration file")

        if user_security_roles_data_file is None:
            raise Exception(
                "'user_security_roles_data_file' setting missing from configuration file")

        if points_data_file is None:
            raise Exception(
                "'points_data_file' setting missing from configuration file")

        self.users_db = db.getDb(users_data_file)
        self.user_revoked_tokens_db = db.getDb(user_revoked_tokens_data_file)
        self.user_security_roles_db = db.getDb(user_security_roles_data_file)
        self.points_db = db.getDb(points_data_file)

    def get_users_db(self) -> db.JsonDatabase:
        return self.users_db

    def get_user_revoked_tokens_db(self) -> db.JsonDatabase:
        return self.user_revoked_tokens_db

    def get_user_security_roles_db(self) -> db.JsonDatabase:
        return self.user_security_roles_db

    def get_points_db(self) -> db.JsonDatabase:
        return self.points_db
