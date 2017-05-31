import csv
import json

full_dictionary = {}
with open('rule.csv') as f:
    reader = csv.reader(f)
    for rule, status, num in reader:
        r = full_dictionary.setdefault(rule, {})
        r.setdefault(num, []).append(status)

print json.dumps(full_dictionary, indent=4)
