from dataclasses import dataclass


@dataclass(frozen=True)
class DataFileConfig:
    users_data_file: str
    points_data_file: str
    revoked_users_data_file: str


@dataclass(frozen=True)
class AppConfig:
    data_files: DataFileConfig
