result=$(curl --request GET \
  --url 'http://localhost:3000/api/scraper?id=1')
echo "Response from server"
echo $result
exit