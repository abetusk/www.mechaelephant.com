#!/usr/bin/python
import os
import sys
import re

from subprocess import call

import cgi
import cgitb
cgitb.enable()

err_img = "/var/www/img/err.png"
img_dir = "/tmp/img/"

form = cgi.FieldStorage()

print "Content-Type: image";
print 

if 'file' in form:

  try:
    fn = re.sub('[^a-zA-Z0-9]*', '', form['file'].value)
    s = open(img_dir + fn, 'rb').read()
    print s
  except IOError:
    print open(err_img, 'rb').read()
else:
  print open(err_img, 'rb').read()

