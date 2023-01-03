# Deploy
TEST_SERVER="depositor.jxndao.com"
PROD_SERVER="jxndao.com"

TEST_UPLOAD="~/storefront/"
# check axios.ts to enable the right API endpoint
DEPLOY_TARGET=$TEST_UPLOAD

deployTarget=$1

URL=$TEST_SERVER
if [ "$deployTarget" == "prod" ]
then
  echo '*************** WARNING: deploying to prod environment ********************************************'
  URL=$PROD_SERVER
fi

rm -rf build
yarn build
# Sync version
echo "syncing build to ubuntu@${URL}:${DEPLOY_TARGET}"
rsync -av --progress --stats --human-readable build "ubuntu@${URL}:${DEPLOY_TARGET}"

