Project in progress...

### Originally group project from Web Design Course
( my original commits are in seleena-orig-git-commits file, all others are squashed for privacy )

App is for building resumes using blocks for each job experience or volunteer experience. These blocks are created individually and can be added to your document later

![](https://user-images.githubusercontent.com/15003074/39401385-d01db1b0-4af8-11e8-9721-2e1fec125048.png)


### Login Credentials

Users: user1, user2, user3
Password (for all): Pass123$

### Get Started with Docker

```shell
$ docker-compose up
```

Access site at http://localhost:9999

### Get Started with Vagrant

```shell
$ vagrant up.
```

The site will run over HTTP (port 8080).
Upon completion of Vagrant Provisioning, access the site at http://localhost:8080


To restart the site processes, do vagrant ssh and then sudo systemctl restart main-project.

If you need to see application logs, do sudo journalctl -u main-project -f -n 1000.

