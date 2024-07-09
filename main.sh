#!/bin/bash

# Number of times to run the command
num_runs=1000

for i in $(seq 1 $num_runs)
do
  nohup sh test.sh >> output.log 2>&1 &
done

echo "Started $num_runs instances of test.sh"