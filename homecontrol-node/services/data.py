from dataclasses import dataclass
from typing import Annotated
from pysondb import db
from wireup import Inject, service
from models.config import DataFileConfig
from services.base import BaseService


@service
class DataService(BaseService):
    users_db: db.JsonDatabase
    revoked_users_db: db.JsonDatabase
    points_db: db.JsonDatabase

    def __init__(self, data_files: Annotated[DataFileConfig, Inject(param="data_files")]):
        super().__init__()

        self.users_db = db.getDb(data_files.get("users_data_file"))
        self.revoked_users_db = db.getDb(data_files.get("points_data_file"))
        self.points_db = db.getDb(data_files.get("points_data_file"))

    def get_users_db(self) -> db.JsonDatabase:
        return self.users_db

    def get_revoked_users_db(self) -> db.JsonDatabase:
        return self.revoked_users_db

    def get_points_db(self) -> db.JsonDatabase:
        return self.points_db
