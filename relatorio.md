# Relatório - Prova Primeiro Bimestre DevOps

**Ferramenta de IA usada: ChatGPT**

## 1. Explique como foi o processo desde o Git até a disponibilização da aplicação na nuvem.

Comecei criando o repositorio no GitHub para colocar o projeto da prova.
Depois comecei a parte da aplicação usando Node.js, Express e PostgreSQL.
A ideia da aplicação era fazer um CRUD de reservas.
Foi feito o POST para cadastrar uma reserva e os GET para consultar.
Também fiz o PUT para alterar e o DELETE para excluir.
Coloquei também o `/health` para testar se a aplicação estava conseguindo falar com o banco.
Depois fui para a parte do Docker, porque precisava deixar a aplicação rodando em container.
Foi criado o Dockerfile e depois o docker-compose com a API e o PostgreSQL.
No Compose coloquei tambem o volume do banco, uma rede e o healthcheck.
Testei primeiro tudo localmente para não levar um projeto quebrado para a AWS.
Depois comecei a parte do Terraform.
Separei a infraestrutura em modulos para VPC, Security Group, EC2 e RDS.
A EC2 ficou com a aplicação e o RDS ficou com o PostgreSQL.
O RDS ficou em subnet privada e a EC2 em subnet publica.
Depois de subir a infraestrutura tive um problema na conexão da aplicação com o RDS.
O erro era relacionado ao SSL do PostgreSQL. Ajustei a conexão da aplicação e fiz o teste novamente.
Depois o `/health` funcionou e fiz os testes de cadastro, consulta, alteração e exclusão.
Também configurei o Remote State usando S3 e DynamoDB.
No final salvei as evidencias e rodei o `terraform destroy` para apagar os recursos criados.

## 2. Explique como a IA foi utilizada durante o desenvolvimento.

Usei o ChatGPT durante o desenvolvimento principalmente quando eu não sabia exatamente como fazer alguma configuração.
Eu ia fazendo as partes e quando aparecia uma duvida perguntava.
Um dos prompts foi mais ou menos pedindo uma estrutura Terraform para uma aplicação Node com EC2 e RDS.
Também perguntei como fazer o Docker Compose com PostgreSQL.
Outra coisa que perguntei foi sobre os Security Groups e como deixar o RDS acessivel somente pela EC2.
Quando apareceu o erro do PostgreSQL na AWS também usei a IA para entender a mensagem.
Nesse caso descobrimos que a conexão estava chegando sem SSL.
Então foi alterado o arquivo de conexão do PostgreSQL para aceitar SSL quando estivesse na AWS.
Depois disso eu mesmo rodei os comandos e conferi se tinha funcionado.
Também usei a IA para tirar duvidas de comandos do Terraform e AWS CLI.
Algumas respostas precisaram ser adaptadas porque eu estava usando o AWS Academy e não uma conta AWS normal.
Por exemplo, no laboratório não podia criar livremente usuarios e roles do IAM.
Então foi usado o que o laboratorio disponibilizava, como o LabRole e o LabInstanceProfile.
Também não aceitei simplesmente que um comando estava certo só porque a IA falou.
Eu rodava no terminal e via o resultado.
Quando dava erro eu mandava o erro para analisar e tentava corrigir.
Então a IA acabou sendo mais uma ajuda durante o projeto.
A parte de testar e decidir se realmente estava funcionando ficou por minha conta.

## 3. Explique a arquitetura AWS utilizada e as limitações do AWS Academy Learner Lab.

A estrutura da AWS foi feita pelo Terraform.
Foi criada uma VPC para separar os recursos do projeto.
Nessa VPC foram criadas subnets publicas e privadas em duas zonas de disponibilidade.
A EC2 ficou na parte publica porque precisava disponibilizar a API.
O RDS ficou na parte privada.
O banco usado foi PostgreSQL pelo Amazon RDS.
Também deixei o RDS como `publicly_accessible = false`.
A porta 5432 do banco não ficou aberta para a internet.
No Security Group do RDS foi colocado acesso vindo do Security Group da EC2.
Para a EC2 foram liberadas as portas que eram necessárias para o projeto, como 22 e 3000.
A aplicação ficava rodando na porta 3000.
A AWS usada na prova foi o Learner Lab da AWS Academy.
Por isso tinha algumas limitações que não existem normalmente em uma conta AWS comum.
Não era para criar nossos proprios usuarios e roles de IAM.
Foi utilizado o LabRole e o LabInstanceProfile disponibilizado pelo ambiente.
As credenciais usadas também eram temporarias e fornecidas pelo laboratorio.
A região usada foi `us-east-1`, conforme pedido na prova.
Também foi feito o Remote State do Terraform usando S3 e DynamoDB.
Depois que terminei os testes, executei o destroy e os 17 recursos da infraestrutura principal foram removidos.

## 4. Explique as validações, segurança e o uso responsável da IA.

Eu fui testando o projeto conforme terminava cada parte.
Primeiro testei a aplicação localmente com o Docker Compose.
O banco PostgreSQL ficava em outro container e a API conseguia acessar ele pela rede do Compose.
Depois testei o `/health` para ver se o banco estava conectado.
Também fiz testes no CRUD, criando uma reserva e depois consultando ela.
Depois alterei e exclui a reserva para ver se estava funcionando.
Na AWS fiz praticamente os mesmos testes.
O `/health` retornou que o banco estava conectado.
Depois fiz POST, GET, GET por ID, PUT e DELETE.
Isso foi importante porque só o Terraform funcionando não significa que a aplicação está funcionando.
Na parte de segurança o RDS não ficou publico.
O acesso na porta 5432 ficou somente para a EC2 através do Security Group.
Também coloquei o `.env` no `.gitignore` para não mandar as informações do banco para o GitHub.
Arquivos do Terraform como o state também ficaram fora do repositorio.
O Docker foi configurado para não rodar a aplicação como root.
Na utilização da IA, procurei usar ela mais para entender erros e configurações.
Quando a IA dava um comando, eu executava e conferia o resultado.
Um exemplo foi o problema do SSL no RDS, que só foi resolvido depois de testar a alteração na aplicação.
No final também fiz o `terraform destroy`, deixando os recursos da infraestrutura principal removidos.
