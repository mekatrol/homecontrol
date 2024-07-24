from dataclasses import dataclass


@dataclass(frozen=True)
class DataFileConfig:
    users_data_file: str
    points_data_file: str
    user_revoked_tokens_data_file: str


@dataclass(frozen=True)
class AppConfig:
    data_files: DataFileConfig
