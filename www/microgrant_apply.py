#!/usr/bin/python
#

import os
import re,cgi,cgitb,sys
import datetime
import errno
import json
import random

import uuid

#import base64, M2Crypto
#def gen_uuid(num_bytes = 16):
#  return base64.b64encode(M2Crypto.m2.rand_bytes(num_bytes))


cgitb.enable()

#SUCCESS_FN = "/var/www/html/mechaelephant/microgrant_apply.html"
#BASE_DIR = "/tmp/ugrant"

SUCCESS_FN = "/var/www/microgrant_apply.html"
BASE_DIR = "/home/meow/ugrant"

def log_fn(fn, s):
  f = open(fn, "a")
  f.write(s)
  f.close()

def slurp_file(fn):
  f = open(fn, "r")
  s = f.read()
  f.close()
  return s

def make_dir(ds):
  yr = str(ds.year)
  mo = str(ds.month)
  da = str(ds.day)

  D = [ BASE_DIR + "/" + yr, BASE_DIR + "/" + yr + "/" + mo, BASE_DIR + "/" + yr + "/" + mo + "/" + da ]

  for d in D:
    try:
      os.makedirs(d)
    except OSError, e:
      if e.errno != 17:
        raise
      pass

  salt = uuid.uuid4()
  ofn = D[2] + "/" + str(ds.hour) + "-" + str(ds.minute) + "-" + str(ds.second) + "-" + str(ds.microsecond) + "-" + str(salt) + ".form"
  return ofn

#print "Content-Type: text/html;charset=utf-8"
#print

ds = datetime.datetime.now()

form = cgi.FieldStorage()

form_fields = ["email", "contact", "asset_type", "libre_history", "extra"]

form_val = {}
form_val["contact"] = "off"
form_val["datestamp"] = str(ds)
for f in form_fields:
  if f in form:
    form_val[f] = form[f].value

ofn = make_dir(ds)

with open(ofn, "w") as fp:
  fp.write(json.dumps(form_val))

#log_fn("/tmp/zonk", ">>>\n")
#for x in form_val:
#  log_fn("/tmp/zonk", str(x) + ":" + str(form_val[x]) + "\n")

#print slurp_file(SUCCESS_FN)


print "Status: 303 See other"
print "Location: microgrant_apply.html"
print
