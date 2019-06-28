# This script will move issues between pipelines on a ZenHub board

import csv
import json
import requests
import sys
import re

IN_PROGRESS = 4
REVIEW = 5
STAGING = 6

GTOKEN = sys.argv[1]
ZTOKEN = sys.argv[2]
REPO = sys.argv[3]
REPO_OWNER = 'NYCPlanning'
GIT_HEADER = {'Authorization': 'token ' + GTOKEN}
ZEN_HEADER = {'X-Authentication-Token': ZTOKEN}

with open('./scripts/python-scripts/csv/repos.txt') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    for row in csv_reader:
        if line_count == 0:
                line_count+=1
        else:
            repo_name = row[0]

            # get repo id
            repo_url = 'https://api.github.com/repos/%s/%s' % (REPO_OWNER, repo_name)
            repo_response = requests.get(repo_url, headers=GIT_HEADER)
            repo_data = json.loads(repo_response.text)
            repo_id = repo_data['id']

            # get branches data
            branch_url = 'https://api.github.com/repos/%s/%s/branches' % (REPO_OWNER, repo_name)
            branch_response = requests.get(branch_url, headers=GIT_HEADER)
            branch_data = json.loads(branch_response.text)
            branches = []
            for i, item in enumerate(branch_data):
                    branches.append(re.split(':| |-',(branch_data[i]['name']))[0])

            # get issues data
            issue_url = 'https://api.github.com/repos/%s/%s/issues' % (REPO_OWNER, repo_name)
            issue_response = requests.get(issue_url, headers=GIT_HEADER)
            issue_data = json.loads(issue_response.text)
            issues_num = []
            for j, item in enumerate(issue_data):
                    issues_num.append(issue_data[j]['number'])

            # get pull requests data
            pr_url = 'https://api.github.com/repos/%s/%s/pulls?state=all&base=develop' % (REPO_OWNER, repo_name)
            pr_response = requests.get(pr_url, headers=GIT_HEADER)
            pr_data = json.loads(pr_response.text)
            pr_num = []
            pr_merges = []
            for k, item in enumerate(pr_data):
                    pr_num.append(re.split(':| |-',(pr_data[k]['title']))[0])
                    pr_merges.append(pr_data[k]['merged_at'])

            # get board data
            board_url = 'https://api.zenhub.io/p1/repositories/%s/board' % (repo_id)
            board_response = (requests.get(board_url, headers=ZEN_HEADER))
            board_data = json.loads(board_response.text)
            in_progress_id = board_data['pipelines'][IN_PROGRESS]['id']
            review_id = board_data['pipelines'][REVIEW]['id']
            staging_id = board_data['pipelines'][STAGING]['id']

            # move issue to 'In Progress' if it corresponds to a feature branch
            for num in issues_num:
                    if str(num) in branches:
                            url = 'https://api.zenhub.io/p1/repositories/%s/issues/%d/moves' % (repo_id, num)
                            params = {'pipeline_id':in_progress_id, 'position':'bottom'}
                            response = requests.post(url, json=params, headers=ZEN_HEADER)

            # move issue to 'Review/QA' if PR has been opened
            for num in issues_num:
                    if str(num) in pr_num:
                            url= 'https://api.zenhub.io/p1/repositories/%s/issues/%d/moves' % (repo_id, num)
                            params = {'pipeline_id':review_id, 'position':'bottom'}
                            response = requests.post(url, json=params, headers=ZEN_HEADER)

            # move issue to 'Staging' if PR has been merged into develop
            for num, merged_at in zip(pr_num, pr_merges):
                    if (merged_at != None):
                        url = 'https://api.zenhub.io/p1/repositories/%s/issues/%d/moves' % (repo_id, int(num))
                        params = {'pipeline_id':staging_id, 'position':'bottom'}
                        response = requests.post(url, json=params, headers=ZEN_HEADER)

            line_count+=1
  