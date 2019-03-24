Household
---------

a management application for household concerns

inspiration from

- [_task management apps_](https://blog.hubspot.com/marketing/best-to-do-list-apps-tools)
- [_more task management apps_](https://clickup.com/blog/task-management-software/)
- [_tab switch animation_](https://codepen.io/Gelsot/pen/eMOvOP)
- [_light/dark theme compatability_](https://medium.com/eightshapes-llc/light-dark-9f8ea42c9081)
- [jchapple/apollo-graphql-express-objection-server](https://github.com/jchapple/apollo-graphql-express-objection-server)
- [jchapple/nextjs-apollo-bulma-boilerplate](https://github.com/jchapple/nextjs-apollo-bulma-boilerplate)
- [async-labs/saas](https://github.com/async-labs/saas)


Generating keys for JWT
------------------------

make sure openssl is installed, then in the /server directory do
```
ssh-keygen -t rsa -b 4096 -m PEM -f private.key
openssl rsa -in private.key -pubout -outform PEM -out public.key
rm private.key.pub
```
do not add a passphrase to the key.  once complete, remove the `private.key.pub` file since it's in the wrong format anyway.