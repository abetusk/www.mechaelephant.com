#!/usr/bin/python

import re,cgi,cgitb,sys
cgitb.enable()

def slurp_file(fn):
  f = open(fn, "r")
  s = f.read()
  f.close()
  return s

template_fn     = "./template/schlib_wizard.template"
template_pin_fn = "./template/schlib_wizard_pin.template"
template_left_fn = "./template/left.template"

max_n           = 99
n               = 16 # default to 16

print "Content-Type: text/html;charset=utf-8"
print

form = cgi.FieldStorage()

if "n" in form :
  n = form["n"].value

headroom = 100
beginning_height = int(n)*50 + 2*headroom

if int(n) > int(max_n):
  print "pin count exceeds limit (limit of", max_n, ")"
  sys.exit(0)

if int(n) < 0:
  print "pin count under 0"
  sys.exit(0)

template            = slurp_file(template_fn) 
pin_input_template  = slurp_file(template_pin_fn)

pin_list = [ " <input type='hidden' id='n' name='n' value='" + str(n) + "' />"]

for i in range(int(n)/2):
  s = re.sub('##N##', str(i+1), pin_input_template)
  pin_list.append(s)

# pure gets confused and leaves the bottom open.  Put a dummy row to try and
# clean it up
if (int(n)%2) == 1:
  pin_list.append(" <tr> <td></td> <td></td> <td></td> <td></td> </tr> ");

tmp_str = re.sub('<!-- ###LEFT### -->', slurp_file(template_left_fn), template)
tmp_str = re.sub('<!-- ###PINL### -->', ' '.join([str(x) for x in pin_list]), tmp_str)
tmp_str = re.sub('###NPIN###', str(n), tmp_str)
tmp_str = re.sub('###HEIGHT###', str(beginning_height), tmp_str)

pin_list_r = [ ]
for i in range(int(n)/2, int(n)):
  s = re.sub('##N##', str(i+1), pin_input_template)
  pin_list_r.append(s)

print re.sub('<!-- ###PINR### -->', ' '.join([str(x) for x in pin_list_r]), tmp_str)

