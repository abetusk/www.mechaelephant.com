#!/usr/bin/python

import re
import os
import cgi
import cgitb
import sys
import werkzeug
import uuid
import shutil
import subprocess as sp
#from subprocess import check_call

cgitb.enable()

def log ( s ):
  f = open( "/tmp/mechaelephant.log", "a" )
  f.write( str(s) + "\n" )
  f.close()


def slurp_file(fn):
  f = open(fn, "r")
  s = f.read()
  f.close()
  return s

tmp_dir = "/tmp/tmp"
upload_dir = "/tmp/upload"
stage_dir = "/tmp/stage"
template_fn     = "./template/gbl_ngc.template"
template_left_fn = "./template/left.template"

ngc_file = None
ngc_uuid = None

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
      error_str = "provide a gerber file"
    else:
      filefield = [filefield]

  if not error_occured:
    ngc_uuid = uuid.uuid4().hex
    ngc_file = stage_dir + "/" + str(ngc_uuid)

    radius = 0.0
  
    call_list = ["/usr/local/bin/gbl2ngc", "-o", ngc_file, "-r", str(radius), "-i"  ]
    for fileitem in filefield:
      fn_uuid = uuid.uuid4().hex
      fn = str(fn_uuid) + werkzeug.secure_filename(fileitem.filename) 
      #dst_fn = "/tmp/upload/" + fn
      dst_fn = upload_dir + "/" + fn
  
      try:
        with open(upload_dir + "/" + fn, "wb") as f:
          shutil.copyfileobj(fileitem.file, f)
        call_list.append(dst_fn)
      except IOError as e:
        error_occured = True
        error_str += "<br />I/O error({0}): {1}".format(e.errno, e.strerror)
  
    ngc_out = tmp_dir + "/" + str(ngc_uuid) + ".out"
    ngc_err = tmp_dir + "/" + str(ngc_uuid) + ".err"

    outfp = None
    errfp = None

    try:

      outfp = open( ngc_out, 'wb' )
      errfp = open( ngc_err, 'wb' )

      #sp.check_call( call_list )
      #sp.check_call( call_list, stdout=open(os.devnull, 'wb'), stderr=open(os.devnull, 'wb') )
      sp.check_call( call_list, stdout=outfp, stderr=errfp )

      outfp.close()
      errfp.close()


    except sp.CalledProcessError as e:
      error_occured = True
      error_str += "<br />gbl2ngc failed:<br />"

      outfp.close()
      errfp.close()

      error_str += slurp_file( ngc_out )
      error_str += slurp_file( ngc_err )

template            = slurp_file(template_fn) 

if error_occured:

  html_error_msg = "<h3>Error occured</h3><p>" + error_str + "</p>"
  x = re.sub("<!-- ###LEFT### -->", slurp_file(template_left_fn), re.sub('<!-- ###NGC_DL### -->', html_error_msg, template) )
  print re.sub("<!-- ###LEFT### -->", slurp_file(template_left_fn), re.sub('<!-- ###NGC_DL### -->', html_error_msg, template) )


else:
  dl_view_str = ""
  init_str = ""
  if ngc_file is not None:
    dl_view_str = "<h3>gbl2ngc output</h3><p><a href='downloadManager.py?id=" +   \
      str(ngc_uuid) +  \
      "%26" + "name=board.ngc'>Download</a></p>" + \
      "<h3>NGC View</h3><p><a href='ngc_view?id=" + str(ngc_uuid) + "' >View</a></p>"


    init_str = "<script> initfunc = function() { downloadNGC(\"" + str(ngc_uuid) + "\",\"board.ngc\" ); }; </script>"
  print re.sub("<!-- ###LEFT### -->", slurp_file(template_left_fn), 
          #re.sub('<!-- ###INITFUNC### -->', init_str,
            re.sub('<!-- ###NGC_DL### -->', dl_view_str, template) )
          #)

