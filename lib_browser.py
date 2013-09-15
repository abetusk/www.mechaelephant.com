#!/usr/bin/python

import re,cgi,cgitb,sys
cgitb.enable()

def slurp_file(fn):
  f = open(fn, "r")
  s = f.read()
  f.close()
  return s

template_fn     = "../template/sch_list.template"
template_left_fn = "../template/left.template"

expanded_left = "<li><a href='/mecha_elephant/sch_list'>/sch_list</a></li>\n \
<li class='indent'><a href='/mecha_elephant/sch_list?foo'>/foo</a></li>\n \
<li class='indent'><a href='/mecha_elephant/sch_list?bar'>/bar</a></li>\n"

print "Content-Type: text/html;charset=utf-8"
print

template            = slurp_file(template_fn) 
tmp_str = re.sub('###LEFT###', slurp_file(template_left_fn), template)

print tmp_str

l = [ "74xgxx", "74xx", "ac-dc", "adc-dac", "analog_switches", "atmel", "audio", "brooktre", "cmos4000", "cmos_ieee", "conn", "contrib", "cypress", "dc-dc", "device", "digital-audio", "display", "dsp", "elec-unifil", "ftdi", "gennum", "graphic", "intel", "interface", "linear", "logo", "memory", "microchip1", "microchip", "microchip_pic10mcu", "microchip_pic12mcu", "microchip_pic16mcu", "microcontrollers", "motorola", "msp430", "nxp_armmcu", "opto", "philips", "powerint", "power", "pspice", "references", "regul", "relays", "sensors", "siliconi", "special", "stm32", "stm8", "supertex", "texas", "transf", "transistors", "ttl_ieee", "valves", "video", "xilinx" ]

expanded_left = ""
for w in l:
  expanded_left += "<li class='indent'><a href='/mecha_elephant/" + w + "'>" + w + "</a></li>\n";


# lest madness follow....
#tmp_str = re.sub('\<li\>\<a [^ ]*sch_list[^ ]*sch_list[^ ]*\<\/li\>', expanded_left, tmp_str)
tmp_str = re.sub('\<li\>\<a [^ ]*sch_list[^ ]*sch_list[^ ]*\<\/li\>', expanded_left, tmp_str)

#print tmp_str

