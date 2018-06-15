#!/usr/bin/python3
# Simple script to parse the devpost dump and place results in a json

import os
import json
from multiprocessing import Pool
import multiprocessing
from bs4 import BeautifulSoup

OUTPUT_FNAME="devpostdump.json"
DUMP_DIR = "output/"



def process_project(project_and_iter):
    i, project = project_and_iter

    print("{} {}".format(i, project))

    proj_html = BeautifulSoup(open(project, 'r').read(), 'html.parser')

    proj_data = {}
    proj_data['name'] = proj_html.find(id='app-title').string
    proj_data['id'] = project[len(DUMP_DIR):]

    # Number of likes and comments
    num_likes =    proj_html.find('span', { 'class' : 'ss-heart' }).next_sibling.next_sibling
    proj_data['num_likes'] = int(num_likes.string) if num_likes is not None else 0
    num_comments = proj_html.find('span', { 'class' : 'ss-quote' }).next_sibling.next_sibling
    proj_data['num_comments'] = int(num_comments.string) if num_comments is not None else 0

    # Length of the description
    proj_data['description_length'] = len(proj_html.find(id="app-details").get_text())

    # Number of contributors
    proj_data['num_contributors'] = len(proj_html.find_all('li', { 'class' : 'software-team-member' }))

    # Tags
    proj_data['tags'] = sorted([tag.string for tag in proj_html.find_all('span', { 'class' : 'cp-tag' })])
    
    # Hackathon details
    hackathon_deets = proj_html.find('div', { 'class' : 'software-list-content' })
    if hackathon_deets:
        proj_data['hackathon_name'] = hackathon_deets.find('a').string
        proj_data['num_prizes'] = len(hackathon_deets.find_all('span', { 'class' : 'winner' }))
    else:
        # We are coing to skip non hackathon hacks for now
        return None

    proj_data['timestamp'] = proj_html.find('time')
    if proj_data['timestamp'] is not None:
        proj_data['timestamp'] = proj_data['timestamp'].get('datetime')
    else:
        return None

    with open(OUTPUT_FNAME, 'a+') as f:
        f.write(json.dumps(proj_data) + '\n')

if __name__ == '__main__':

    projects = [os.path.join(DUMP_DIR, f) for f in os.listdir(DUMP_DIR)]

    if os.path.exists(OUTPUT_FNAME):
        os.remove(OUTPUT_FNAME)

    with Pool() as p:
        p.map(process_project, enumerate(projects), chunksize=1)

        # f = open(OUTPUT_FNAME, "w+")
        # f.write("[")
        # for i, proj in enumerate(projects):
            # obj = process_project(i, proj)
            # if obj:
                # f.write(json.dumps(obj))
                # f.write(",")

        # f.write("]")

