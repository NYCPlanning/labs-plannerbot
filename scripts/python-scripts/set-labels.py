# This script will remove the GitHub default labels and create custom labels for a repo

import csv
import requests
import sys

TOKEN = sys.argv[1]
REPO = sys.argv[2]
REPO_OWNER = 'NYCPlanning'
REPO_LIST = './scripts/python-scripts/csv/repos.txt'
HEADER = {'Authorization': 'token ' + TOKEN, 'Accept': 'application/vnd.github.symmetra-preview+json'}

TO_DELETE = ['bug', 'duplicate', 'enhancement', 'help%20wanted', 'good%20first%20issue', 'invalid', 'question', 'wontfix', 'documentation']

TO_CREATE = ['Strategic', 'High ROI', 'Easy Win', 'Luxury', 'Testing', 'Bug', 'Critical Bug', 'Blocked', 'Data Request', 'Refactor', 'Accessibility', 'User Feedback', 'New Feature', 'Needs Clarification']
DESC = ['High impact, high level of effort. Used for work prioritization.',
        'High impact, low level of effort. Used for work prioritization.',
        'Low impact, low level of effort. Used for work prioritization.',
        'Low impact, high level of effort. Used for work prioritization.',
        'Related to automated tests',
        'Broken feature or unexpected behavior that negatively impacts the experience of using the app',
        'A critical, high priority bug that keeps users from being able to use the app',
        'An issue blocked by an external factor',
        'Related to request for new data layers',
        'Related to refactoring code',
        'Related to improving accessibility for all users, including those with disabilities',
        'Feedback provided by a user',
        'Request for a new feature or new functionality',
        'Issue or user story is unclear. More info needed.']
COLORS = ['6600bb', '660066', 'bb0066', 'bb00bb', '92ad27', 'd36315', 'e21f18', 'eaac72', 'e5df37', '32c9a6', 'aee5ef', '5319e7', 'c9f29b', '2278c9']

# Delete GitHub's default labels
def delete_labels(repo):
    for i in TO_DELETE:
        DELETE_URL = 'https://api.github.com/repos/%s/%s/labels/%s' % (REPO_OWNER, repo, i)
        response = requests.delete(DELETE_URL, headers=HEADER)

# Create custom labels
def create_labels(repo):
    CREATE_URL = 'https://api.github.com/repos/%s/%s/labels' % (REPO_OWNER, repo)
    for j in range(14):
        PARAMS = {"name":TO_CREATE[j], "description":DESC[j], "color":COLORS[j]}
        response = requests.post(CREATE_URL, json=PARAMS, headers=HEADER)


if REPO == 'all':
    with open(REPO_LIST) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        for row in csv_reader:
            if line_count == 0:
                line_count+=1
            else:
                repo_name = row[0]
                delete_labels(repo_name)
                create_labels(repo_name)
                line_count+=1
else:
    delete_labels(REPO)
    create_labels(REPO)

               