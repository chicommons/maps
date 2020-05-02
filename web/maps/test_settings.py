from .settings import *


class DisableMigrations(object):
    # ref: https://stackoverflow.com/a/28560805/12578202

    def __contains__(self, item):
        return True

    def __getitem__(self, item):
        return None


MIGRATION_MODULES = DisableMigrations()