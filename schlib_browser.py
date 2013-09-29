#!/usr/bin/python

import re,cgi,cgitb,sys
import os
import urllib
cgitb.enable()

def slurp_file(fn):
  f = open(fn, "r")
  s = f.read()
  f.close()
  return s

def find_max_width_height(s):
  m = re.search('svg\s*height="(\d+)"\s*width="(\d+)"', s)
  if m:
    a = int(m.group(1))
    b = int(m.group(2))
    if a > b: return a
    return b

  m = re.search('svg\s*width="(\d+)"\s*height="(\d+)"', s)
  if m:
    a = int(m.group(1))
    b = int(m.group(2))
    if a > b: return a
    return b

  return 1000


print "Content-Type: text/html;charset=utf-8"
print


form = cgi.FieldStorage()

display_lib = None
if "lib" in form:
  display_lib = form["lib"].value
  display_lib = urllib.quote( display_lib )
  display_lib = re.sub('[^a-zA-Z0-9_\%\.-]*', '', display_lib)

display_component = None
if "name" in form:
  display_component = form["name"].value
  display_component = urllib.quote( display_component )
  display_component = re.sub('[^a-zA-Z0-9_\%\.-]*', '', display_component)




template_fn     = "./template/schlib_browser.template"
template_left_fn = "./template/left.template"

expanded_left = "<li><a href='/mecha_elephant/sch_list'>/sch_list</a></li>\n \
<li class='indent'><a href='/mecha_elephant/sch_list?foo'>/foo</a></li>\n \
<li class='indent'><a href='/mecha_elephant/sch_list?bar'>/bar</a></li>\n"

template            = slurp_file(template_fn) 
tmp_str = template.replace("###LEFT###", slurp_file(template_left_fn))


if display_lib is not None and display_component is not None:
  tmp_str = tmp_str.replace("###WD###", "/ " + display_lib + " / " + display_component )
elif display_lib is not None:
  tmp_str = tmp_str.replace("###WD###", "/ " + display_lib )
else:
  tmp_str = tmp_str.replace("###WD###", "")


l = [ "74xgxx", "74xx", "ac-dc", "adc-dac", "analog_switches", "atmel", "audio", "brooktre", "cmos4000", "cmos_ieee", "conn", "contrib", "cypress", "dc-dc", "device", "digital-audio", "display", "dsp", "elec-unifil", "ftdi", "gennum", "graphic", "intel", "interface", "linear", "logo", "memory", "microchip1", "microchip", "microchip_pic10mcu", "microchip_pic12mcu", "microchip_pic16mcu", "microcontrollers", "motorola", "msp430", "nxp_armmcu", "opto", "philips", "powerint", "power", "pspice", "references", "regul", "relays", "sensors", "siliconi", "special", "stm32", "stm8", "supertex", "texas", "transf", "transistors", "ttl_ieee", "valves", "video", "xilinx" ]

expanded_left = ""
for w in l:
  expanded_left += "<li class='indent'><a href='/mecha_elephant/" + w + "'>" + w + "</a></li>\n";


lib_col = 8
lib_row = len(l) / lib_col
if len(l) % lib_col:
  lib_row += 1

tbl = [ "<table width='100%' class='pure-table-dense pure-table-bordered'>" ]
pos = 0
for r in range(lib_row):
  tbl.append("  <tr>")
  for c in range(lib_col):
    if pos >= len(l):
      tbl.append("    <td></td>")
    else:
      tbl.append("    <td><a href='/schlib_browser/" + l[pos] + "'>" + l[pos] + "</a></td>")
    pos += 1
  tbl.append("  </tr>")
tbl.append("</table>")

tbl_str = "\n".join(tbl)

tmp_str = tmp_str.replace("###LIB_TABLE###", tbl_str)

tbl_lib = [ ]
base_eeschema_dir = "eeschema"

if display_component is not None:

  try:
    display_svg_file = display_component + ".svg"
    svg_fn = base_eeschema_dir + "/svg/" + display_lib + "/" + display_svg_file

    svg_component = slurp_file( svg_fn )

    tbl_lib.append("<table class='pure-table-dense pure-table-bordered' width='100%'>")
    tbl_lib.append("<tr>")
    tbl_lib.append("  <td style='vertical-align:middle; text-align:center; align:center;' >")
    #tbl_lib.append("  <img src='/" + svg_fn + "' alt='foo' />")

    #uhg
    #svg_component = svg_component.replace("<line", "<line shape-rendering='crispEdges' ")
    #svg_component = svg_component.replace("scale( 0.15,0.15 )", "scale(0.2,0.25)")

    tbl_lib.append( svg_component )

    display_name = urllib.unquote( display_component )

    tbl_lib.append( "<br/>" + display_name )
    tbl_lib.append("  </td>")
    tbl_lib.append("</tr>")
    tbl_lib.append("</table>")

  except IOError:
    tbl_lib.append("error displaying component " + display_svg_file + ", " + svg_fn )
    pass




if display_component is None and display_lib in l:

  try:
    base_jpg_dir = base_eeschema_dir + "/jpg/"

    lib_n = len(os.listdir( base_jpg_dir + display_lib))
    lib_col = 4
    lib_row = lib_n / lib_col
    if lib_n % lib_col:
      lib_row += 1

    pcnt = "{0}%".format( 100/lib_col )

    tbl_lib.append("<table class='pure-table-dense pure-table-bordered' width='100%'>")
    tbl_lib.append("<tr>")

    count =  0
    n = os.listdir( base_jpg_dir + display_lib)

    for fn_simple in os.listdir( base_jpg_dir + display_lib):
      fn_encoded = urllib.quote( fn_simple )
      part_name = re.sub( '\.jpg$', '', fn_encoded )
      fn = "/" + base_jpg_dir + display_lib + "/" + fn_encoded
      ss = "<a href='/schlib_browser/" + display_lib + "/" + part_name + "'>"
      ss += "  <img  class='fixed-img-width' src='" + fn + "' />  "
      ss += "</a>"

      display_name = urllib.unquote( fn_simple )
      display_name = re.sub('\.jpg', '', display_name )
      style_hints = " style='vertical-align:middle; text-align:center; align:center;' "
      width_hints = " width='200px' " 
      class_hints = " class='pure-table-tabular' "
      tbl_lib.append(" <td" + style_hints + width_hints + class_hints + ">" + ss + "<br />" + display_name + "</td> ")


      count += 1
      if (count % lib_col) == 0:
        tbl_lib.append("  </tr>")
        if (count < n):
          tbl_lib.append("  <tr>")

    if (count % lib_col) == 0:
      tbl_lib.append("  </tr>")

    tbl_lib.append("</table>")

  except:
    tbl_lib.append("error, " + base_jpg_dir + ", " + display_lib)
    pass

tmp_str = tmp_str.replace("###LIB_SVG_TABLE###", "\n".join(tbl_lib))

print tmp_str

