from dataclasses import dataclass


@dataclass
class UserModel:
    id: int
    userName: str
    roles: list[str]
