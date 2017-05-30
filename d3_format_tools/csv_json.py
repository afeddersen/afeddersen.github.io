# -*- coding: utf-8 -*-
"""Convert flat data (csv) to nested JSON.

Usage example:

    $ python csv_json.py data.csv

"""

import csv
import json
import sys

tree = {}

reader = csv.reader(open(sys.argv[1], 'rb'))
reader.next()
for row in reader:
    subtree = tree
    for k, v in enumerate(row):  # key, value
        if v:
            if v not in subtree:
                subtree[v] = {} if k < len(row) - 1 else 1
            subtree = subtree[v]

print json.dumps(tree, indent=4)
