passed=0
total=0
echo "" | cat > output.txt
for i in `ls ./0*`
do
  echo "==== $i ====" | cat >> output.txt 
  sh $i >> output.txt
  if [ $?==0 ]; then
    echo "Test passed $i" | cat >> output.txt
    passed=$(($passed + 1)) 
  else 
    echo "Test failed $i" | cat >> output.txt
  fi
  total=$(($total + 1)) 
   
done
echo "========" | cat >> output.txt
echo "Passed : $passed" | cat >> output.txt
echo "Total : $total" | cat >> output.txt

