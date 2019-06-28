# This script will create a milestone across all repos and boards

import csv
import requests
import sys

TOKEN = sys.argv[1]
REPO = sys.argv[2]
REPO_OWNER = 'NYCPlanning'
REPO_LIST = './scripts/python-scripts/csv/repos.txt'
SPRINT_LIST = './scripts/python-scripts/csv/sprints.txt'
HEADER = {'Authorization': 'token ' + TOKEN}

def set_milestone(repo, line):
    title = line[0]
    due_on = line[1]
    url = 'https://api.github.com/repos/%s/%s/milestones' % (REPO_OWNER, repo)
    params = {"title":title, "due_on":due_on}
    response = requests.post(url, json=params, headers=HEADER)

if REPO == 'all':
    with open(REPO_LIST) as csv_file:
        csv_f1 = csv.reader(csv_file, delimiter=',')
        f1_count = 0
        for row in csv_f1: 
            if f1_count == 0:
                f1_count+=1
            else:
                repo_name = row[0]

                with open(SPRINT_LIST) as csv_file:
                    csv_f2 = csv.reader(csv_file, delimiter=',')
                    f2_count = 0
                    for row2 in csv_f2:
                        if f2_count == 0:
                            f2_count+=1
                        else:
                            set_milestone(repo_name, row2)
                            f2_count+=1

                f1_count+=1
else:
    with open(SPRINT_LIST) as csv_file:
        csv = csv.reader(csv_file, delimiter=',')
        line_count = 0
        for row in csv:
            if line_count == 0:
                line_count+=1
            else:
                set_milestone(REPO, row)
                line_count+=1
