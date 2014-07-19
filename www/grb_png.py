#!/usr/bin/python

import re
import cgi
import cgitb
import sys
import werkzeug
import uuid
import shutil
from subprocess import check_call

cgitb.enable()

def slurp_file(fn):
  f = open(fn, "r")
  s = f.read()
  f.close()
  return s

img_get = "img_get"
template_fn     = "./template/grb_png.template"
template_left_fn = "./template/left.template"

gerber_png_file = None
gerber_uuid = None

form = cgi.FieldStorage()

error_occured = False
error_str = ""

print "Content-Type: text/html;charset=utf-8"
print
if "files" in form:
  filefield = form["files"]

  if not isinstance(filefield, list):
    if filefield.filename is None or filefield.filename == "":
      error_occured = True
      error_str = "provide at least one gerber file"
    else:
      filefield = [filefield]

  if not error_occured:
    gerber_uuid = uuid.uuid4().hex
    gerber_png_file = "/tmp/img/" + gerber_uuid
  
    call_list = ["/usr/bin/gerbv", "-x", "png", "-o", gerber_png_file, "-w", "512x512", "--"]
    for fileitem in filefield:
      fn = werkzeug.secure_filename(fileitem.filename)
      dst_fn = "/tmp/upload/" + fn
  
      try:
        with open('/tmp/upload/' + fn, "wb") as f:
          shutil.copyfileobj(fileitem.file, f)
        call_list.append(dst_fn)
      except IOError as e:
        error_occured = True
        error_str += "<br />I/O error({0}): {1}".format(e.errno, e.strerror)
  
    try:
      check_call( call_list )
    except CalledProcessError as e:
      error_occured = True
      error_str += "<br />gerbv failed"
  
  
template            = slurp_file(template_fn) 

if error_occured:
  html_error_msg = "<h3>Error occured</h3><p>" + error_str + "</p>"
  print re.sub("<!-- ###LEFT### -->", slurp_file(template_left_fn), re.sub('<!-- ###GRB_IMG### -->', html_error_msg, template) )

else:
  img_str = ""
  if gerber_png_file is not None:
    img_str = "<h3>gerbv output</h3><p><img src='" + img_get + "?file=" + str(gerber_uuid) + "' /> </p>"
  #print re.sub('###GRB_IMG###', img_str, template)
  print re.sub("<!-- ###LEFT### -->", slurp_file(template_left_fn), re.sub('<!-- ###GRB_IMG### -->', img_str, template) )

