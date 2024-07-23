from marshmallow import fields, Schema


class UserModel(Schema):
    id = fields.String()
    username = fields.String()
