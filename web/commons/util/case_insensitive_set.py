from collections import MutableSet


class CaseInsensitiveSet(MutableSet):
    def __init__(self, *values):
        self._values = {}
        self._fold = str.casefold
        for v in values:
            self.add(v)

    def __contains__(self, value):
        return self._fold(value) in self._values

    def __iter__(self):
        return iter(self._values.values())

    def __len__(self):
        return len(self._values)

    def add(self, value):
        self._values[self._fold(value)] = value

    def discard(self, value):
        try:
            del self._values[self._fold(value)]
        except KeyError:
            pass

