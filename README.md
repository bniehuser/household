Household
---------

a management application for household concerns

inspiration from

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