#!/usr/bin/python

import re,sys,datetime,cgi,cgitb
cgitb.enable()

debug = False
download_fn = "mylib.lib"

def error_and_exit(var):
  print 
  print "error, var", var, "missing, exiting"
  sys.exit(0)

if debug:
  print "Content-type: text/html"
else:
  print "Content-type: text/plain"


form = cgi.FieldStorage()
if "name"       not in form: error_and_exit("name")
if "reference"  not in form: error_and_exit("reference")
if "n"          not in form: error_and_exit("n")

n = None
if isinstance(form["n"], list):
  n = int(form["n"][0].value)
else:
  n = int(form["n"].value)

layout_type = "D"
if "layout_type" in form:
  layout_type = form["layout_type"].value


#for i in range( int(form["n"].value) ):
for i in range( n ):
  if "pin_num" + str(i+1) not in form: error_and_exit("pin_num" + str(i+1))
  if "pin_name" + str(i+1) not in form: error_and_exit("pin_name" + str(i+1))
  if "pin_type" + str(i+1) not in form: error_and_exit("pin_type" + str(i+1))
  if "pin_format" + str(i+1) not in form: error_and_exit("pin_format" + str(i+1))



name        = form["name"].value
reference   = form["reference"].value
#n           = int(form["n"].value)

name = name.strip()
if name == "": name = "~"

reference = reference.strip()
if reference == "": reference = "~"

num_font_size = 60
if "num_font_size" in form: num_font_size = form["num_font_size"].value

font_size = 60
if "name_font_size" in form: font_size = form["name_font_size"].value


width = 500
height = (n * 100 / 2) + 200
pin_length = 300
pin_height = 100

if "width"  in form: width  = int( form["width"].value )
if "height" in form: height = int( form["height"].value )


if not debug:
  print "Content-Disposition: attachement;filename=\"" + name + ".lib" + "\""
print

print "EESchema-LIBRARY Version 2.2  Date:", datetime.datetime.now().strftime("%d/%m/%Y-%H:%M:%S")
print "#"
print "#", name
print "#"


print "DEF", name, reference, "0", "40", "Y", "Y", 1, "0", "N"
print "F1", '"' + str(name) + '"', 0, -100, font_size, "H", "V", "C", "C"
print "F0", '"' + str(reference) + '"', 0, 100, font_size, "H", "V", "C", "C"
print "DRAW"


print "S", -width/2, -height/2, width/2, height/2, 1, 0, 0, "N"

if n < 1:
  print "ENDDRAW"
  print "ENDDEF"
  print "#"
  print "#End Library"
  sys.exit(0)

# DIP

for i in range(n):
  ind = str(i+1)
  pnam = form["pin_name" + ind].value
  pnum = form["pin_num" + ind].value
  typ = form["pin_type" + ind].value
  fmt = form["pin_format" + ind].value

  pnam = pnam.strip()
  if pnam == "": pnam = "~"

  pnum = pnum.strip()
  if pnum == "": pnum = "~"

  if layout_type == "D":

    base_y = int((n-1)/2)*50

    if i < int((n+1)/2):
      posx = -width/2 - pin_length
      posy = base_y - (100*i)
      orient = "R"
    else:
      posx = width/2 + pin_length
      posy = -base_y + (100*i-n*50)
      orient = "L"

  elif layout_type == "S":

    base_y = (n-1)*50

    posx = -width/2 - pin_length
    posy = base_y - i*100
    orient = "R"

  elif layout_type == "Q":

    n_left  = int((n+3)/4)
    n_bot   = int((n+2)/4)
    n_right = int((n+1)/4)
    n_top   = int(n/4)

    if i < n_left:

      p = i
      base_y = (n_left-1) * pin_height / 2
      posx = -width/2 - pin_length
      posy = base_y - p*100
      orient = "R"

    elif i < (n_left + n_bot):

      p = i - n_left
      base_x = -(n_bot-1) * pin_height / 2
      posx =  base_x + p*pin_height
      posy = -height/2 - pin_length
      orient = "U"

    elif i < (n_left + n_bot + n_right):

      p = i - n_left - n_bot
      base_y = -(n_right-1) * pin_height / 2
      posx = width/2 + pin_length
      posy = base_y + p*100
      orient = "L"

    else:

      p = i - n_left - n_bot - n_right
      base_x = (n_top-1) * pin_height / 2
      posx =  base_x -  p*pin_height
      posy = height/2 + pin_length
      orient = "D"


  fmt = fmt.strip()

  # http://en.wikibooks.org/wiki/Kicad/file_formats#X_record_.28Pin.29
  # says name_font_size then num_font_sze, but KiCAD definitely renders it the other 
  # way around.
  if fmt == "." or fmt == "":
    print "X", pnam, pnum, posx, posy, pin_length, orient, num_font_size, font_size, "1", 1, typ
  else:
    print "X", pnam, pnum, posx, posy, pin_length, orient, num_font_size, font_size, "1", 1, typ, fmt



print "ENDDRAW"
print "ENDDEF"
print "#"
print "#End Library"




