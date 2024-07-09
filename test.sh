result=$(curl --silent --request GET \
  --url 'http://localhost:3000/api/scraper?apiKey=891e4f50-8842-480b-82a7-a55e0b9c37e5&engine=true')
echo "Response from server"
echo $result
exit