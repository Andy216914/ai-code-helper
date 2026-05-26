# Java Learning Roadmap

A staged roadmap for learning Java and becoming employable as a backend / full-stack engineer. Topics are ordered roughly by dependency: earlier phases unlock later ones.

Legend used below:
- **(Must-learn)** core, do not skip
- **(Should-learn)** important for most jobs, especially backend
- **(Optional)** learn if you have time or the role calls for it

---

## Phase 1: Programming language fundamentals

**Goal:** Be able to read and write small Java programs comfortably. After this phase, you should be able to solve basic algorithmic problems in Java and build a small console or GUI app.

### Topics

**Java basics (Must-learn)**
- JDK / JRE / JVM distinction; installing a recent LTS JDK (Java 17 or 21 in 2024–2026)
- IDE setup: IntelliJ IDEA (Community is free; JetBrains gives students free Ultimate)
- Project structure, build/run/debug
- Primitive types and their wrapper classes (`int`/`Integer`, `long`/`Long`, etc.); autoboxing
- `==` vs `equals()`; the `equals` / `hashCode` contract
- Strings: `String` immutability, `StringBuilder`, `StringBuffer`
- Control flow, arrays
- Methods, overloading vs overriding
- Object-orientation: classes, encapsulation, inheritance, polymorphism, abstract classes vs interfaces
- Enums
- Common standard-library classes: `String`, `Math`, dates/times (`java.time`)
- Collections: `List`, `Set`, `Map`, `Queue` and common implementations (`ArrayList`, `LinkedList`, `HashMap`, `LinkedHashMap`, `TreeMap`, `HashSet`)
- Generics (and type erasure at a high level)
- Annotations (use first, write your own later)
- Exception handling: checked vs unchecked, `try/catch/finally`, try-with-resources
- I/O streams; basic file reading/writing
- Multithreading basics: `Thread`, `Runnable`, `synchronized`, `volatile` (deep dive comes later)
- Reflection (read-only knowledge is enough at first)

**Modern Java features (Should-learn)**
- Lambda expressions and functional interfaces
- Streams API (`filter`, `map`, `reduce`, `collect`)
- `Optional`
- The `java.time` API (`LocalDate`, `Instant`, `Duration`)
- `var` local-variable type inference
- Records, sealed classes, pattern matching for `instanceof` and `switch` (Java 17+)
- Text blocks
- Default and static methods on interfaces

### Common interview questions
1. What are the eight primitive types and their wrappers?
2. Difference between `==` and `equals()`. Why must you override `hashCode` when overriding `equals`?
3. Difference between `String`, `StringBuilder`, `StringBuffer`. Which is thread-safe?
4. How does Java handle exceptions? Checked vs unchecked. What are `final` / `finally` / `finalize`?
5. Overloading vs overriding.
6. Abstract class vs interface — when to use which?
7. What is type erasure? What can't you do with generics because of it?
8. How does `ArrayList` differ from `LinkedList` in time complexity?
9. Why does `0.1 + 0.2 != 0.3` in Java? (IEEE-754 floating point)
10. What does the `final` keyword do on a class, method, and field?

### Learning tips
- Type code yourself; don't just watch tutorials.
- Learn to use the debugger early — step through code line by line.
- The first language is the hardest. Push through the early discomfort.

---

## Phase 2: Computer science fundamentals

**Goal:** Get comfortable with data structures, algorithms, and the systems your code runs on. This is what interviews — especially in the US — lean on heavily.

### Data structures & algorithms (Must-learn)

These are foundational and tested everywhere:

- **Arrays and strings** — two pointers, sliding window, prefix sums
- **Linked lists** — reverse, detect cycle, merge sorted
- **Stacks and queues** — monotonic stack, priority queue / heap
- **Hash tables** — frequency counting, deduplication, lookup
- **Trees** — binary tree traversals (preorder/inorder/postorder/level), BST, balanced trees (AVL, red-black at a concept level)
- **Heaps / priority queues** — top-K, k-way merge, scheduling
- **Tries** — prefix matching
- **Graphs** — BFS, DFS, Dijkstra, topological sort, union-find
- **Sorting** — quicksort, mergesort, heapsort; know when each wins
- **Searching** — binary search and its variants
- **Recursion and backtracking**
- **Dynamic programming** — 1D and 2D, knapsack, LCS/LIS, edit distance
- **Bit manipulation** basics
- **Big-O analysis** — time and space, average vs worst case

### How to practice
- **LeetCode** is the standard practice platform. Aim for ~200–300 problems for solid US interview readiness, focused on the [NeetCode 150](https://neetcode.io) or [Blind 75](https://www.techinterviewhandbook.org/grind75) lists rather than random problems.
- Practice writing solutions on a whiteboard or in a plain editor — not in the IDE — to simulate interview conditions.
- For each problem, after solving, look at the discussion / editorial and learn the cleanest approach.
- Spaced repetition: revisit problems you've solved a week later.

### Computer science survey (Should-learn)
- How computers work at a high level: CPU, memory hierarchy, cache, disk, OS process model
- Binary, two's complement, floating point
- Compilers vs interpreters (Java is both — compiled to bytecode, JIT-interpreted)

### Operating systems (Should-learn)
- Processes vs threads; how the OS schedules them
- Inter-process communication (pipes, shared memory, sockets)
- Concurrency primitives: locks, semaphores, condition variables, monitors
- Deadlock: four necessary conditions and how to prevent
- Memory management: virtual memory, paging, page faults
- Filesystems at a high level
- Recommended reading: *Operating Systems: Three Easy Pieces* (free online, excellent)

**Common interview questions:**
- What is a deadlock? What conditions cause it?
- Process vs thread vs coroutine.
- What states does a thread go through?
- How does paging / virtual memory work?

### Computer networking (Should-learn)
- OSI 7-layer and TCP/IP 4-layer models (know roughly what each layer does)
- IP, TCP vs UDP, when to use each
- TCP three-way handshake and four-way close — and why three/four
- HTTP/1.1, HTTP/2, HTTP/3 differences; HTTPS / TLS at a high level
- DNS resolution flow
- Cookies, sessions, tokens (JWT)
- CORS, CSRF, XSS at a basic level
- Recommended reading: *Computer Networking: A Top-Down Approach* (Kurose & Ross)

**Common interview questions:**
- Difference between TCP and UDP. When would you use UDP?
- Why is the TCP handshake three steps? Why is close four steps?
- Difference between HTTP and HTTPS. What does TLS actually do?
- What happens when you type a URL into a browser and press Enter? (Walk through DNS → TCP → TLS → HTTP → render.)

---

## Phase 3: Enterprise development basics

**Goal:** Build a complete backend web project end-to-end. After this phase you should be able to ship a simple CRUD app on a server.

### Databases — relational (Must-learn)

Most enterprise data lives in a relational database. **MySQL** and **PostgreSQL** are the two most common; learn one well.

- Basic SQL: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `JOIN` types, `GROUP BY`, `HAVING`, subqueries, window functions
- Schema design: normalization (1NF/2NF/3NF), denormalization tradeoffs, choosing data types
- Indexes: B+ tree structure, clustered vs secondary, composite indexes, leftmost-prefix rule, covering indexes
- Storage engines (MySQL): InnoDB vs MyISAM
- Transactions: ACID, isolation levels (read uncommitted / read committed / repeatable read / serializable), what each prevents
- Locking: row vs table locks, gap locks
- The `EXPLAIN` plan and reading it
- Performance tuning: index design, slow query log, avoiding `SELECT *`, pagination at scale
- Connection pooling (HikariCP is the default in Spring Boot)

**Common interview questions:**
- Explain MySQL's leftmost-prefix rule on composite indexes.
- What isolation level is the default in MySQL? In PostgreSQL?
- Difference between clustered and secondary index in InnoDB.
- Why does MySQL use B+ trees for indexes instead of hash tables or B-trees?
- What's the difference between `INNER JOIN` and `LEFT JOIN`? Show an example where they differ.
- Walk through how an indexed range query is executed.

### Spring ecosystem (Must-learn for most Java jobs)

The Java backend world is built around Spring. There is no real substitute.

- **Spring Core**: dependency injection (IoC), bean lifecycle, configuration (Java config preferred over XML)
- **Spring AOP**: aspects, pointcuts, when to use AOP (logging, transactions, security)
- **Spring MVC**: controllers, request mapping, `@RestController`, request/response binding, exception handlers, interceptors
- **Spring Data JPA / Hibernate** (or **MyBatis** for SQL-first style — both common; MyBatis dominates in China, JPA more common in the US/EU)
- **Spring Boot**: auto-configuration, starters, profiles, externalized config, Actuator for health/metrics
- **Spring Security**: authentication, authorization, password hashing (BCrypt), OAuth2 / OIDC, JWT validation
- **Spring Test**: `@SpringBootTest`, MockMvc, slice tests (`@WebMvcTest`, `@DataJpaTest`)

**Common interview questions:**
- What is dependency injection and what problem does it solve?
- Difference between `@Component`, `@Service`, `@Repository`, `@Controller` — is it just naming?
- Bean scopes: singleton vs prototype vs request.
- How does Spring Boot's auto-configuration work?
- What design patterns does Spring use heavily? (Factory, proxy, template method, observer.)
- How does Spring AOP work under the hood? (JDK dynamic proxies for interfaces, CGLIB for classes.)

### Build tools (Must-learn)
- **Maven** — the default in most enterprise Java codebases. Know the lifecycle (validate → compile → test → package → install → deploy), how `pom.xml` works, dependency management, parent POMs, scopes, the local repo.
- **Gradle** — increasingly common, especially in newer projects and Android. Groovy or Kotlin DSL.

You don't need to memorize this. Know the basic commands and read docs as needed.

### Version control — Git (Must-learn)
- The mental model: working directory → staging area → local repo → remote
- Daily commands: `clone`, `add`, `commit`, `push`, `pull`, `fetch`, `status`, `diff`, `log`
- Branching: `branch`, `checkout`/`switch`, `merge`, `rebase`, `cherry-pick`
- Resolving conflicts
- `git stash`, `git reset` (soft / mixed / hard), `git revert` — when to use which
- Pull request / code review workflow (GitHub or GitLab)
- Gitflow vs trunk-based development (most modern teams trunk-based)
- `.gitignore`

**Common interview questions:**
- Difference between `merge` and `rebase`. When is `rebase` dangerous?
- How do you undo the last commit without losing changes? With losing changes?
- What is a fast-forward merge?

### Linux (Must-learn for backend)

Most servers are Linux. You must be comfortable on the command line.

- Filesystem hierarchy (`/etc`, `/var`, `/usr`, `/home`, `/tmp`)
- File / process / user management: `ls`, `cd`, `cp`, `mv`, `rm`, `chmod`, `chown`, `ps`, `top`/`htop`, `kill`
- Text processing: `cat`, `less`, `grep`, `sed`, `awk`, `head`/`tail`, `wc`, `sort`, `uniq`
- Networking: `curl`, `wget`, `ss`/`netstat`, `nc`, `ping`, `dig`/`nslookup`
- Pipes and redirection
- Environment variables and `PATH`
- Package management (`apt` on Debian/Ubuntu, `yum`/`dnf` on RHEL/CentOS/Rocky)
- Service management with `systemd` (`systemctl start/stop/status/enable`)
- Disk / memory inspection: `df`, `du`, `free`
- Shell scripting basics (Bash)
- SSH key setup, `scp`/`rsync` for file transfer
- `vim` or `nano` at a basic level — you'll need one when SSH'd in

**Common interview questions:**
- How do you find the PID of a process and view its CPU/memory usage?
- How do you tail a large log file and grep for a pattern in real time?
- Difference between soft and hard links.
- How do you see which port a process is listening on?

### Frontend basics (Should-learn even for backend devs)

You don't need to be a frontend specialist, but understanding the client-server contract makes you a better backend engineer.

- HTML, CSS basics
- JavaScript fundamentals; ES6+ features (`let`/`const`, arrow functions, destructuring, modules, `async`/`await`, promises)
- The fetch API / AJAX, REST API contracts
- One modern framework — **React** is the most common in the US; **Vue** is more common in China. Either is fine for understanding.
- How a SPA differs from server-rendered pages

---

## Phase 4: Backend advanced topics

**Goal:** Build production-grade systems. Learn the tools you'll actually use at work to make systems fast, reliable, and maintainable.

### Software engineering fundamentals

- The software development lifecycle: requirements → design → implementation → test → deploy → maintain
- Code review etiquette
- Testing: unit (JUnit 5 + Mockito), integration, end-to-end; the test pyramid
- Continuous integration concepts
- Reading other people's code; using a debugger and logs to diagnose issues
- Recommended reading: *The Pragmatic Programmer*, *Clean Code* (with a critical eye — not every rule is dogma)

### Design patterns (Should-learn)

The GoF patterns are still relevant in Java because the language and frameworks lean on them heavily.

- **Creational**: singleton, factory method, abstract factory, builder, prototype
- **Structural**: adapter, decorator, proxy, facade, composite, flyweight, bridge
- **Behavioral**: strategy, observer, command, state, template method, chain of responsibility, iterator, mediator, visitor

You don't need to memorize all 23. Know the ~10 most common (singleton, factory, builder, adapter, decorator, proxy, strategy, observer, template method, chain of responsibility) and recognize the rest. Recommended reading: *Head First Design Patterns*.

**Common interview questions:**
- Implement a thread-safe singleton in Java. (Double-checked locking with `volatile`, or enum singleton, or static holder.)
- When would you use the strategy pattern over a chain of `if/else`?
- What design patterns does Spring use?

### Caching — Redis (Must-learn for backend)

Caching is non-negotiable for performant systems. Redis is the default.

- Core data types: strings, lists, hashes, sets, sorted sets, bitmaps, HyperLogLog, streams
- Common commands per type
- Persistence: RDB snapshots, AOF append-only log, the tradeoffs
- Expiration and eviction policies (`noeviction`, `allkeys-lru`, `volatile-lru`, `allkeys-lfu`, etc.)
- Replication, Sentinel, and Cluster topologies
- Lua scripting for atomic multi-step operations
- Pub/sub and Streams
- Distributed locking with Redis (and why naive `SETNX` is unsafe — see Redlock debates, and prefer Redisson or a dedicated coordinator like ZooKeeper / etcd when correctness matters)
- Three classic problems and their fixes:
  - **Cache penetration** (queries for nonexistent keys): use a bloom filter or cache the empty result with a short TTL
  - **Cache breakdown** (one hot key expires under load): use a mutex around recompute, or set "never expire" with background refresh
  - **Cache avalanche** (many keys expire simultaneously): jitter the TTLs, use multi-tier caching
- Client libraries: Spring Data Redis, Lettuce, Jedis, Redisson

**Common interview questions:**
- Why is Redis so fast?
- Compare RDB and AOF. Which would you choose?
- How would you use Redis to implement a rate limiter? A leaderboard? A "last 10 viewed items" feed?
- Explain cache penetration / breakdown / avalanche and how to mitigate each.
- How do you keep the cache consistent with the database on writes? (Cache-aside vs write-through vs write-behind; double-delete pattern.)

### Message queues (Must-learn for backend)

Used for asynchronous processing, decoupling services, smoothing traffic spikes, and reliable inter-service communication.

- **Why** use a queue: async work, decoupling producers/consumers, traffic buffering, retry semantics
- **Kafka** — the dominant choice for event streaming and high-throughput pipelines. Topics, partitions, consumer groups, offsets, ISR replicas, retention. Used heavily in the US.
- **RabbitMQ** — feature-rich classic broker. Exchanges (direct, topic, fanout, headers), queues, bindings, dead-letter queues, delayed messages.
- **RocketMQ** — Alibaba's broker, very common in China. Transactional messages.
- **Apache Pulsar** — newer, decouples compute and storage; growing adoption.
- **SQS / SNS / EventBridge** (AWS) — managed alternatives if you're on AWS.
- Concepts you must understand regardless of broker:
  - Delivery semantics: at-most-once, at-least-once, exactly-once (and why exactly-once is mostly a lie at the broker level — you typically achieve it by making consumers idempotent)
  - Idempotency: how to design consumers that can safely re-process a message
  - Ordering guarantees and partitioning
  - Dead-letter queues
  - Backpressure

**Common interview questions:**
- Why use a message queue? What problems does it solve?
- How do you guarantee a message is not lost? Producer side, broker side, consumer side?
- How do you make consumers idempotent?
- Kafka vs RabbitMQ — when would you pick which?
- How does Kafka guarantee message ordering?

### Nginx / reverse proxy (Should-learn)

- What a reverse proxy does vs a forward proxy
- Load balancing strategies (round-robin, least-connections, IP hash, weighted)
- TLS termination
- Static file serving
- Rate limiting, basic WAF features
- Common config: `server` blocks, `location` blocks, upstreams
- Alternatives: HAProxy, Envoy, Caddy, AWS ALB

### Netty / async networking (Optional, but loved by interviewers at large companies)

- Java NIO basics: `Channel`, `Buffer`, `Selector`
- Blocking vs non-blocking I/O; `select` / `epoll` model
- The Netty event-loop model
- WebSocket implementation with Netty
- When you'd reach for Netty vs Spring WebFlux vs plain servlets

### Microservices (Should-learn for jobs at companies that use them — most do)

- Why decompose: scale teams, scale parts of the system independently, fault isolation
- The fallacies of distributed computing (network is reliable, latency is zero, bandwidth is infinite — all false)
- **Service discovery**: Eureka, Consul, Nacos, ZooKeeper, or Kubernetes' built-in DNS
- **Inter-service communication**: REST/JSON, gRPC, message queues
- **API gateways**: Spring Cloud Gateway, Kong, Envoy, AWS API Gateway
- **Configuration**: Spring Cloud Config, Consul, etcd, AWS Parameter Store
- **Circuit breakers / resilience**: Resilience4j (the modern replacement for Hystrix), Sentinel
- **Distributed tracing**: OpenTelemetry, Jaeger, Zipkin
- **Centralized logging**: ELK / OpenSearch, Loki
- **Distributed transactions**: 2PC, Saga, TCC, outbox pattern — and why you should try hard to avoid them
- **Idempotency** in distributed systems
- The CAP theorem and PACELC; what you actually trade off in practice

**Common interview questions:**
- When should you NOT use microservices?
- How do you handle a service-to-service call failing?
- What is a circuit breaker? When does it open / half-open / close?
- How do you do a distributed transaction across two services? (Saga is the usual answer.)
- How does eventual consistency manifest to the user, and how do you design around it?

### Containers and orchestration (Must-learn in 2024–2026)

- **Docker**: images vs containers, Dockerfile, multi-stage builds, volumes, networks, Docker Compose for local dev
- **Kubernetes**: Pods, Deployments, Services, Ingress, ConfigMaps, Secrets, namespaces, labels and selectors; basic `kubectl` commands; reading a Pod's lifecycle and crash reasons
- Container registries: Docker Hub, ECR, GCR, GHCR
- Helm at a basic level

You'll rarely be asked to write Kubernetes manifests in an interview, but you'll be expected to understand the concepts and have used `kubectl` at least to debug.

### CI/CD (Should-learn)

- The CI/CD model: every commit gets built, tested, and (if it passes) deployed automatically
- One pipeline tool: **GitHub Actions** (most common for open source and US startups), **GitLab CI**, Jenkins (still common in enterprise), CircleCI, Buildkite
- Concepts: pipeline stages, secrets management, environment promotion (dev → staging → prod), canary / blue-green / rolling deploys

### Cloud platforms (Should-learn at least one in the US market)

- **AWS** is the most common in US jobs. Know at a minimum: EC2, S3, RDS, IAM, VPC basics, ELB, Lambda, CloudWatch. The AWS Certified Cloud Practitioner cert is a low-effort signal if you have no production AWS experience.
- **GCP** and **Azure** are also major; GCP for ML-leaning work, Azure for enterprise / Microsoft shops.
- In China, **Alibaba Cloud** and **Tencent Cloud** are the dominant providers.

---

## Phase 5: Build real projects

**Goal:** Have 2–3 nontrivial projects you can talk about in depth on your resume.

See [building-projects-guide.md](building-projects-guide.md) for detail. Briefly:

- Build projects end-to-end. A half-finished project is worth almost nothing for a resume.
- At least one project should be deployed and publicly accessible (a domain + HTTPS) so you can demo it.
- For each project, write a README that covers: what problem it solves, architecture diagram, tech stack, your role, hard problems and how you solved them, metrics if possible.
- Don't list 10 toy projects. List 2–3 substantial ones.

---

## Phase 6: Java advanced topics

Once you're employable, deepen. These are common topics in mid-to-senior backend interviews.

### Concurrency in Java (deep dive)

- The Java Memory Model: happens-before, visibility, ordering
- `synchronized` semantics and the lock-upgrade path (biased → lightweight → heavyweight) in HotSpot; note: biased locking was deprecated and is removed in modern JDKs
- `volatile` — what it guarantees and what it does not
- `java.util.concurrent`:
  - `ReentrantLock`, `ReadWriteLock`, `StampedLock`
  - `Semaphore`, `CountDownLatch`, `CyclicBarrier`, `Phaser`, `Exchanger`
  - `ConcurrentHashMap`, `CopyOnWriteArrayList`, blocking queues
  - `ExecutorService`, `ScheduledExecutorService`, thread pools — how to size them, how to handle rejections
  - `CompletableFuture` — composition, error handling, custom executor
  - `ForkJoinPool`, parallel streams (and when they hurt more than help)
- `AbstractQueuedSynchronizer` (AQS) — the building block under most JUC locks
- CAS, `Atomic*` classes, `LongAdder`
- `ThreadLocal` — pitfalls in thread pools (always clean up; consider `InheritableThreadLocal` and `ScopedValue` in newer JDKs)
- **Virtual threads (Project Loom)** — stable since JDK 21. Major change to how you write concurrent Java; structured concurrency follows.

**Common interview questions:**
- What does `volatile` guarantee that `synchronized` doesn't, and vice versa?
- How would you size a thread pool? (CPU-bound vs I/O-bound formulas; measure before assuming.)
- What's the difference between `ConcurrentHashMap` in Java 7 vs Java 8?
- How does AQS work?
- When would virtual threads NOT help?

### JVM internals

- Memory regions: heap (young / old), metaspace, stack, PC register, native method stack, direct memory
- Class loading: load → link (verify, prepare, resolve) → initialize; the parent delegation model and when you'd break it (app servers, OSGi)
- Garbage collection:
  - Algorithms: mark-sweep, mark-compact, copying, generational
  - Collectors: Serial, Parallel, CMS (deprecated), G1 (the default since JDK 9), ZGC, Shenandoah
  - GC roots; reachability
  - Stop-the-world pauses
- JIT compilation: C1, C2, tiered compilation, GraalVM as an alternative
- Bytecode basics; reading with `javap -c`
- Tuning flags (`-Xms`, `-Xmx`, `-XX:+UseG1GC`, etc.) — but defaults are excellent now; tune only with evidence
- Diagnostic tools:
  - `jps`, `jstack`, `jmap`, `jstat`, `jcmd`
  - JFR (Java Flight Recorder) — built-in, low overhead, your best friend in production
  - VisualVM, JConsole, Async Profiler
  - **Arthas** — Alibaba's open-source live diagnostic tool, very popular in China
- Heap dump analysis with Eclipse MAT
- Common production issues: memory leak, OOM (heap vs metaspace vs direct), high CPU, long GC pauses, deadlock — and how to diagnose each

**Common interview questions:**
- Walk through what happens when you allocate an object: where it goes, when it gets promoted, when it gets collected.
- What is the parent delegation model? Why does it exist? When would you violate it?
- Stop-the-world is unavoidable in most GCs. Why?
- A production service has gradually rising memory and eventually OOMs. How do you debug it?
- What is escape analysis and how does it affect allocation?

### System design / architecture

- High availability: redundancy, failover, multi-AZ / multi-region, chaos engineering
- High concurrency: caching, async processing, queueing, connection pooling, horizontal scaling
- Database scaling: read replicas, sharding (horizontal partitioning), vertical partitioning, choosing a shard key
- Consistency models: strong, eventual, causal, read-your-writes
- The CAP theorem and PACELC tradeoffs
- Idempotency at scale
- Common building blocks: object storage, search (Elasticsearch / OpenSearch), time-series DBs, columnar warehouses (BigQuery, Snowflake, ClickHouse)
- Distributed coordination: ZooKeeper, etcd, Consul
- Consensus algorithms at a conceptual level: Raft, Paxos
- Service mesh: Istio, Linkerd
- DDD (domain-driven design) at a conceptual level: bounded contexts, aggregates, entities vs value objects

**Recommended reading:**
- *Designing Data-Intensive Applications* by Martin Kleppmann — the single most useful book in this list
- *System Design Interview* (vols. 1 & 2) by Alex Xu — interview-focused
- The [System Design Primer](https://github.com/donnemartin/system-design-primer) GitHub repo

---

## Phase 7: Job hunting

Covered in [job-search-guide.md](job-search-guide.md).

---

## Phase 8: Continuous learning

Industry-leading engineers never stop learning. After landing your first job, deepen in areas your work touches and stay curious about adjacent fields.

### Reading source code

Reading well-written codebases is one of the highest-leverage learning activities:

- Spring Framework, Spring Boot
- Netty
- Guava
- HikariCP (small, beautifully written)
- Caffeine (modern cache library)
- Hibernate or MyBatis
- Kafka clients
- The JDK itself (`java.util.concurrent` package is famously well-designed)

### Areas to deepen

- **Big data / streaming**: Spark, Flink, Kafka Streams, Beam
- **Search**: Elasticsearch, OpenSearch
- **Observability**: Prometheus + Grafana, OpenTelemetry, distributed tracing
- **SRE topics**: SLIs/SLOs/SLAs, error budgets, incident management, postmortems
- **Security**: OWASP Top 10, secure SDLC, threat modeling
- **Performance engineering**: profiling, async profiler, flame graphs, USE method, RED method

### Frontier / emerging

- **GraalVM native image** — compiling Java to a native binary; great cold-start for Lambda-style workloads
- **Project Loom / virtual threads** — already shipped, but still changing how libraries are built
- **AI in coding workflows** — Copilot, Claude, etc., are now part of daily work for most engineers; learn to use them well (and to know when not to trust them)
- **WebAssembly on the server**
- **Edge compute and Serverless**

### Habits

- Subscribe to engineering blogs you respect (Netflix, Uber, Discord, Meta, Cloudflare, AWS Builders' Library, High Scalability)
- Follow individual engineers on Twitter/X or Mastodon — Brian Goetz, Martin Thompson, Kelsey Hightower, etc.
- Read one technical book a quarter
- Write — blog posts, internal docs, RFCs — writing forces clarity

---

## Resources reference

### English / global
- **Documentation**: Oracle JDK docs, Spring docs (excellent), official docs of whatever you use
- **Books**: *Effective Java* (Bloch), *Java Concurrency in Practice* (Goetz), *Designing Data-Intensive Applications* (Kleppmann), *Head First Design Patterns*, *The Pragmatic Programmer*
- **Communities**: Stack Overflow, Reddit r/java r/learnprogramming r/cscareerquestions, the [Hacker News](https://news.ycombinator.com) feed
- **Interview prep**: LeetCode, NeetCode, [Tech Interview Handbook](https://www.techinterviewhandbook.org), [System Design Primer](https://github.com/donnemartin/system-design-primer), Educative.io system design course, [Hello Interview](https://www.hellointerview.com)
- **YouTube channels worth subscribing to**: NeetCode, ThePrimeagen, Marco Behler (Spring/Java focused), Defog Tech, Java Brains

### China
- **Communities**: 掘金 (Juejin), CSDN, 思否 (SegmentFault), 牛客网 (Nowcoder) — Nowcoder is the standard interview prep site in China
- **Course platforms**: Bilibili (huge volume of free programming tutorials in Chinese, including the channels of 黑马程序员, 尚硅谷, 狂神说, 鱼皮/codefather)
- **Books in Chinese translation**: 《深入理解 Java 虚拟机》(周志明) — the most-recommended JVM book in China, *Java 核心技术* (Horstmann, translated)
- **Common reference repos in Chinese**: JavaGuide, CS-Notes, advanced-java
