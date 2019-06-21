# This script will create a milestone across all repos and boards

import csv
import requests
import sys

TOKEN = sys.argv[1]
REPO_OWNER = 'NYCPlanning'
HEADER = {'Authorization': 'token ' + TOKEN}

with open('./scripts/python-scripts/csv/test-repos.txt') as csv_file:
    csv_f1 = csv.reader(csv_file, delimiter=',')
    f1_count = 0
    for row in csv_f1: 
        if f1_count == 0:
            f1_count+=1
        else:
            repo_name = row[0]

            with open('./scripts/python-scripts/csv/sprints.txt') as csv_file:
                csv_f2 = csv.reader(csv_file, delimiter=',')
                f2_count = 0
                for row2 in csv_f2:
                    if f2_count == 0:
                        f2_count+=1
                    else:
                        # Set milestone
                        title = row2[0]
                        due_on = row2[1]
                        url = 'https://api.github.com/repos/%s/%s/milestones' % (REPO_OWNER, repo_name)
                        params = {"title":title, "due_on":due_on}
                        response = requests.post(url, json=params, headers=HEADER)
                        f2_count+=1

            f1_count+=1
