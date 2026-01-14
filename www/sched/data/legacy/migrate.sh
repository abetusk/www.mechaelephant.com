#!/bin/bash

rm -f sched.json

echo "{" >> sched.json

echo '  "param":{' >> sched.json
echo '    "today_highlight_color":"#fccc",' >> sched.json
echo '    "cell_height":"2.05em"' >> sched.json
echo '  },' >> sched.json

jq -c '.sched[]' sched_legacy.json | \
  sed 's/^{"Date" *: */  /' | \
  sed 's/ 00:00:00" *, */"/' | \
  sed 's/"Title" *: */:/' | \
  sed 's/"\* */"/g' | \
  sed 's/}$/,/' >> sched.json


echo '  "2030-01-01":""' >> sched.json
echo "}" >> sched.json
