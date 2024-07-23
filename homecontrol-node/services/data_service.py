from dataclasses import dataclass
from typing import Annotated
from pysondb import db
from wireup import Inject, service
from entities.config import DataFileConfig
from services.base import BaseService


@service
class DataService(BaseService):
    users_db: db.JsonDatabase
    revoked_users_db: db.JsonDatabase
    points_db: db.JsonDatabase

    def __init__(self, data_files: Annotated[DataFileConfig, Inject(param="data_files")]):
        super().__init__()

        users_data_file = data_files.get("users_data_file")
        revoked_users_data_file = data_files.get("revoked_users_data_file")
        points_data_file = data_files.get("points_data_file")

        if users_data_file is None:
            raise Exception(
                "'users_data_file' setting missing from configuration file")

        if revoked_users_data_file is None:
            raise Exception(
                "'revoked_users_data_file' setting missing from configuration file")

        if points_data_file is None:
            raise Exception(
                "'points_data_file' setting missing from configuration file")

        self.users_db = db.getDb(users_data_file)
        self.revoked_users_db = db.getDb(revoked_users_data_file)
        self.points_db = db.getDb(points_data_file)

    def get_users_db(self) -> db.JsonDatabase:
        return self.users_db

    def get_revoked_users_db(self) -> db.JsonDatabase:
        return self.revoked_users_db

    def get_points_db(self) -> db.JsonDatabase:
        return self.points_db
