# Deploy
TEST_SERVER="test.jxndao.com"

TEST_UPLOAD="~/storefront-test/"
PROD_UPLOAD="~/storefront-prod/"
# check axios.ts to enable the right API endpoint
DEPLOY_TARGET=$TEST_UPLOAD

deployTarget=$1

URL=$TEST_SERVER
if [ "$deployTarget" == "prod" ]
then
  echo "*************** WARNING: deploying to prod environment ubuntu@${URL}:${DEPLOY_TARGET}************************************"
  URL=$PROD_SERVER
fi

rm -rf build
yarn build
# Sync version
echo "syncing build to ubuntu@${URL}:${DEPLOY_TARGET}"
rsync -av --progress --stats --human-readable build "ubuntu@${URL}:${DEPLOY_TARGET}"

