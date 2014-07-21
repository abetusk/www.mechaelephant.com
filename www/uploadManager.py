#!/usr/bin/python

import re
import cgi
import cgitb
import sys
import json
import uuid
import subprocess as sp

cgitb.enable();

staging_base = "/tmp/stage"

u_id = -1


print "Content-Type: application/json"
print
print

form = cgi.FieldStorage()
if "fileData" in form:
  u_id = uuid.uuid4()
  fn = staging_base + "/" + str(u_id)
  f = open( fn, "wb" )
  f.write( form.getvalue('fileData') )
  f.close()

  print "{ \"id\":\"" + str(u_id) + "\" } "

