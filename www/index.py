#!/usr/bin/python

import re, cgi, cgitb, sys
cgitb.enable()

def slurp_file(fn):
  f = open(fn, "r")
  s = f.read()
  f.close()
  return s

template_fn = "./template/index.template"
template_left_fn = "./template/left.template"

print "Content-Type: text/html;charset=utf-8"
print

template_index = slurp_file(template_fn)
template_left = slurp_file(template_left_fn)

print re.sub("<!-- ###LEFT### -->", template_left, template_index)

