import requests
from bs4 import BeautifulSoup
from subprocess import Popen

# 1 to 2685
i = 0
for i in range(1, 101):
    
    # get page
    r = requests.get("https://devpost.com/software/newest?page=%d" % i)

    page_soup = BeautifulSoup(r.text, 'html.parser')

    for hacklink in page_soup.find_all('a'):
        if hacklink.has_attr('class') and 'link-to-software' in hacklink['class']:
            proj_url = hacklink.get('href', None)
            if not proj_url:
                continue

            p = Popen(['wget', hacklink.get('href'), '-q', '-P' 'output'])
            # project_text = requests.get(hacklink.get('href')).text
            # project_title = BeautifulSoup(project_text, 'html.parser').find(id="app-title").string
            # print "%d %s" % (i, project_title)
            # i += 1


