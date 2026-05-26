# Common Software Engineering Interview Questions

A practical reference of questions that come up repeatedly in interviews for backend / Java / full-stack roles. Organized by topic. Each section lists the questions; for each question, you should be able to give a structured, ~2-minute answer with at least one concrete example.

**How to use this doc**: don't memorize answers. Use it as a checklist of topics where you should be able to talk fluently. If a question seems unfamiliar, that's a study target.

The two markets covered:
- **US market** — emphasizes algorithms, system design, and behavioral. Less language-trivia, less framework-internals depth.
- **China market** — heavier emphasis on Java internals, JVM, framework source-code knowledge, and ecosystem-specific tooling (Redis, MQ, MyBatis).

Notes per section indicate which market emphasizes a topic more.

---

## Java fundamentals
*(China market: heavy. US market: moderate, mostly for Java-specific roles)*

### Language and types
- What are the eight primitive types in Java and their wrapper classes?
- Difference between `==` and `equals()`. Why must `hashCode()` be overridden together with `equals()`?
- Describe the `equals` / `hashCode` contract.
- Difference between `String`, `StringBuilder`, `StringBuffer`. Which are thread-safe?
- Why are Strings immutable? What problems would mutability cause (caching, security, concurrency)?
- What is the String constant pool? When does `new String("abc")` create one object or two?
- What is autoboxing / unboxing? Where does it bite you? (HashMap with `Long` keys, NullPointerException on unboxing a `null` `Integer`, performance in hot loops.)
- Explain `final`, `finally`, `finalize`. (Three unrelated things despite the names.)
- Explain method overloading vs overriding. Can you override a static method?
- Explain abstract class vs interface. Since Java 8, what new capabilities did interfaces gain (default methods, static methods, private methods)?
- What is the diamond problem and how does Java handle it?
- Why doesn't Java support multiple inheritance of classes?
- Explain Java generics and type erasure. What can't you do because of erasure (e.g., `new T()`, `instanceof T`, generic arrays)?
- What are bounded wildcards (`? extends T`, `? super T`)? When do you use which? (PECS — Producer-Extends, Consumer-Super.)
- What are checked vs unchecked exceptions? When would you use which?
- What is try-with-resources and what is the `AutoCloseable` interface?
- Reflection: what is it, when is it useful, what are the costs?
- What are annotations? How do you write a custom annotation processed at runtime?
- Difference between `Comparable` and `Comparator`.
- What is the difference between `==` and `.equals()` on `Integer` objects in the range `-128` to `127`? (Integer cache.)

### Collections
- Compare `ArrayList`, `LinkedList`, and `Vector`. Time complexity of each operation.
- Compare `HashMap`, `LinkedHashMap`, `TreeMap`. When would you use each?
- Describe how `HashMap` works internally. What changed between Java 7 and Java 8? (Array + linked list → array + linked list + red-black tree above threshold; rehash strategy; head-insert → tail-insert to fix concurrent-modification cycle.)
- Why is `HashMap`'s default capacity 16 and load factor 0.75?
- What is `ConcurrentHashMap` and how is it different from `Hashtable`? How does the locking strategy differ between Java 7 (segment locks) and Java 8 (CAS + synchronized on bucket)?
- Why is `HashMap` not thread-safe? What can go wrong if you use it from multiple threads?
- What is `CopyOnWriteArrayList`? When is it appropriate?
- Compare `HashSet`, `LinkedHashSet`, `TreeSet`.
- What is fail-fast vs fail-safe iteration? Give an example of each.
- Difference between `Iterator` and `ListIterator`.
- What is the difference between `Collection` and `Collections`?
- Why does iterating a `HashMap` not return entries in insertion order? Which Map preserves insertion order?
- How would you make an `ArrayList` thread-safe? (Collections.synchronizedList, CopyOnWriteArrayList, manual locking — tradeoffs.)

### Concurrency
*(Heavy in both markets, but China interviews go deeper into internals)*
- Describe the Java thread states.
- How do you create a thread? (Extend `Thread`, implement `Runnable`, `Callable` with `FutureTask`, `ExecutorService`.)
- Why is implementing `Runnable` usually preferred over extending `Thread`?
- Difference between `Runnable` and `Callable`.
- Explain `synchronized` — at instance level, static method, code block. What object does each lock?
- Explain `volatile`. What does it guarantee (visibility, partial ordering)? What does it NOT guarantee (atomicity)?
- Explain the Java Memory Model and happens-before.
- What is the difference between `wait()` / `notify()` (Object methods) and `await()` / `signal()` (Condition methods)?
- Why must `wait()` be called inside a `synchronized` block?
- Explain `ThreadLocal`. What memory pitfalls exist? (Leak in long-lived thread pools if not cleaned up.)
- Compare `Lock` (`ReentrantLock`) and `synchronized`. When would you pick `Lock`?
- What is a `ReadWriteLock`? When is it valuable?
- Explain AQS (AbstractQueuedSynchronizer). What primitives are built on it?
- Explain CAS. What is the ABA problem? How do you mitigate it (`AtomicStampedReference`)?
- What is the difference between `CountDownLatch`, `CyclicBarrier`, `Semaphore`?
- Explain `CompletableFuture`. How do you compose dependent futures? How do you handle exceptions?
- What is a `ForkJoinPool` and when would you use parallel streams?
- Describe the seven parameters of `ThreadPoolExecutor`. What are the four standard rejection policies?
- How do you size a thread pool? (CPU-bound: N+1; I/O-bound: N × (1 + W/C); measure in practice.)
- What is the danger of `Executors.newCachedThreadPool()` / `newFixedThreadPool()` defaults? (Unbounded queue or unbounded threads.)
- What are virtual threads (Project Loom) introduced in JDK 21? When do they help and when do they not? (Help: I/O-bound work, easier write-blocking style; don't help: CPU-bound work, code that pins the carrier thread via `synchronized` over blocking calls.)
- What is a deadlock? Show four conditions for it. How can you detect one in production?
- What is starvation? What is livelock?
- Explain the lock-upgrade path in `synchronized` (biased → lightweight → heavyweight). Note: biased locking was deprecated in JDK 15 and is no longer enabled by default.

### JVM
*(China market: very heavy. US market: lighter, mostly for Java-specific senior roles)*
- Describe the JVM memory layout. (Heap with young/old gen, metaspace, stack, PC register, native method stack, direct memory.)
- Why does the JVM separate young and old generations? (Generational hypothesis — most objects die young.)
- Describe a full GC cycle in G1 / ZGC.
- What are GC roots? Give examples.
- What is "stop the world"? Why is some STW unavoidable?
- Compare GC algorithms: mark-sweep, mark-compact, copying, generational.
- Compare GC collectors: Serial, Parallel, CMS (deprecated), G1 (default since JDK 9), ZGC, Shenandoah.
- What problems do CMS and G1 each address?
- How does ZGC achieve sub-millisecond pause times? (Colored pointers, load barriers, region-based concurrent compaction.)
- Walk through what happens when you allocate a new object. (TLAB → Eden → survivor → promotion to old gen, or direct allocation to old if too big.)
- Explain the JVM class-loading process (load → link [verify, prepare, resolve] → initialize).
- What is the parent delegation model? Why does it exist? When and how do you violate it (Tomcat, OSGi, hot reload)?
- What is JIT compilation? What are C1 and C2? What is tiered compilation?
- What is escape analysis? When can it eliminate allocation?
- What are common JVM tuning flags? (`-Xms`, `-Xmx`, `-XX:+UseG1GC`, `-XX:MaxGCPauseMillis`, etc.) When would you tune?
- A production service shows gradually rising memory and eventually OOMs. How do you debug?
- High CPU on a Java process — how do you diagnose? (`top -Hp <pid>` → take thread ID hex → `jstack` and search.)
- What tools do you know for live JVM diagnosis? (`jps`, `jstack`, `jmap`, `jstat`, `jcmd`, JFR, async-profiler, Arthas.)

---

## Databases — SQL and design
*(Heavy in both markets)*

### SQL and design
- Difference between `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `FULL OUTER JOIN`. Show an example where they return different results.
- Difference between `WHERE` and `HAVING`.
- Difference between `UNION` and `UNION ALL`.
- Explain normalization (1NF, 2NF, 3NF). When do you intentionally denormalize?
- What is a primary key vs unique key vs foreign key?
- What is the difference between `DELETE`, `TRUNCATE`, and `DROP`?
- How does pagination work, and how does it break down at scale? (`LIMIT/OFFSET` becomes slow on deep pages; use keyset pagination.)
- Explain window functions (`ROW_NUMBER`, `RANK`, `DENSE_RANK`, `LAG`, `LEAD`).
- Find the second-highest salary in a table. (Classic question, multiple approaches.)
- Find duplicate rows. Delete duplicates while keeping one of each.

### MySQL specifics
*(China: very heavy. US: lighter unless role-relevant)*
- Compare InnoDB and MyISAM. (Transactions, row-level locking, foreign keys, crash recovery.)
- Why does InnoDB use B+ trees for its indexes rather than B-trees, hash tables, or red-black trees? (Reduced height, sequential leaf nodes for range scans, all data in leaves.)
- What is a clustered index? How is it different from a secondary (non-clustered) index in InnoDB?
- What is a covering index? Why does it speed up queries?
- Explain the leftmost-prefix rule on composite indexes.
- When does MySQL fail to use an index even if one exists? (Function on column, leading wildcard `LIKE '%x'`, type mismatch, OR across non-indexed columns, very low cardinality.)
- Read the output of `EXPLAIN`. What do `type`, `key`, `rows`, `Extra` mean? Which `type` values are "good"?
- Explain transaction isolation levels and what each one prevents:
  - READ UNCOMMITTED: dirty reads possible
  - READ COMMITTED: prevents dirty reads
  - REPEATABLE READ: prevents non-repeatable reads (MySQL's default)
  - SERIALIZABLE: prevents phantom reads
- How does MySQL's REPEATABLE READ avoid phantom reads in practice (gap locks / next-key locks)?
- Difference between optimistic and pessimistic locking. When to use each.
- What is MVCC? How does InnoDB implement it (undo log, read view)?
- Explain InnoDB's three logs: redo log, undo log, binlog. What does each do?
- What is the two-phase commit between redo log and binlog?
- Master-slave replication: how does it work? What is replication lag and how do you handle it?
- When and how would you do horizontal sharding (分库分表)? What is your sharding key strategy?
- What problems does sharding create? (Cross-shard joins, global uniqueness, transactions, rebalancing.)
- Compare strategies for generating distributed primary keys (UUID, snowflake, segment / batch from DB, leaf service).

### PostgreSQL specifics
*(US market — common; less asked in China)*
- Difference between PostgreSQL's MVCC implementation and MySQL/InnoDB's.
- What is `VACUUM` and why is it needed? (Reclaim space from old row versions.)
- Difference between `bytea`, `text`, `jsonb` storage.
- Explain partial indexes and expression indexes.
- What advantages does PostgreSQL offer over MySQL? (Stronger SQL standard compliance, richer types incl. JSONB and arrays, better extensibility via extensions.)

### NoSQL
- When would you choose a document store (MongoDB) over a relational DB?
- When would you choose a key-value store?
- When would you choose a wide-column store (Cassandra, ScyllaDB)?
- When would you choose a time-series DB (InfluxDB, TimescaleDB)?
- What is eventual consistency? Give an example where it's acceptable and where it's not.

---

## Caching and Redis
*(Heavy in both markets, with more depth in China)*

- Why is Redis so fast? (In-memory, single-threaded for commands (no lock contention), efficient data structures, I/O multiplexing.)
- Describe Redis's primary data types and one use case for each: strings, lists, hashes, sets, sorted sets, bitmaps, HyperLogLog, streams, geo.
- Compare RDB and AOF persistence. What are the tradeoffs? How would you combine them?
- What is AOF rewrite? What are the AOF `fsync` policies (`always`, `everysec`, `no`)?
- Explain Redis eviction policies (`noeviction`, `allkeys-lru`, `volatile-lru`, `allkeys-lfu`, `volatile-lfu`, `allkeys-random`, `volatile-random`, `volatile-ttl`).
- Explain cache **penetration** — query for nonexistent data swamps the DB. Mitigations: bloom filter, caching empty results with short TTL.
- Explain cache **breakdown** — single hot key expires under load. Mitigations: mutex around recompute, "never expire" with background refresh, logical expiration.
- Explain cache **avalanche** — many keys expire simultaneously. Mitigations: TTL jitter, multi-tier cache, ensure cache cluster HA.
- How do you keep the cache consistent with the database on writes? Compare cache-aside, write-through, write-behind. Explain the "double-delete" pattern and its limitations.
- How would you implement distributed locking with Redis? Discuss the pitfalls of naïve `SETNX`. What is Redlock and what are the controversies around it (Kleppmann vs Antirez debate)?
- Compare Redis Sentinel and Redis Cluster.
- How does Redis Cluster route keys? (16,384 hash slots, CRC16 of key mod 16384.)
- What is a hash tag in Redis Cluster? When do you use it?
- Explain Redis transactions (`MULTI` / `EXEC` / `DISCARD` / `WATCH`). Why don't they support rollback on runtime errors?
- When would you use Lua scripts in Redis? Why?
- How would you implement a rate limiter with Redis? (Fixed window, sliding window, token bucket.)
- How would you implement a leaderboard? (Sorted set, `ZADD` and `ZRANGE`.)
- How would you implement an idempotency key store?
- What is the difference between Memcached and Redis?
- Local cache vs distributed cache — when do you use which? Tradeoffs.
- What is multi-tier caching (e.g., Caffeine + Redis)? When is the local tier safe vs dangerous (consistency)?

---

## Message queues
*(Heavy in both markets; Kafka stronger in US, RocketMQ/RabbitMQ stronger in China)*

### General
- Why use a message queue? What problems does it solve? (Asynchronous processing, decoupling, traffic smoothing, broadcast.)
- What are the costs of introducing a queue? (Operational complexity, eventual consistency, harder debugging, message ordering issues.)
- Explain at-most-once, at-least-once, and exactly-once delivery semantics. Which is achievable in practice?
- Why do you need idempotent consumers? How do you build one?
- What is a dead-letter queue and when does a message end up there?
- How do you guarantee message ordering? Tradeoffs.
- How do you guarantee a message is not lost? Cover producer, broker, and consumer sides.

### Kafka
*(Strong emphasis in US market)*
- Describe Kafka's storage model. (Topics → partitions → segments; append-only log.)
- What is a consumer group? How does Kafka assign partitions to consumers?
- How does Kafka achieve high throughput? (Sequential disk writes, zero-copy via `sendfile`, batching, page-cache reliance.)
- Explain ISR (in-sync replicas). What happens if a replica falls behind?
- Explain the high-water mark and the log-end offset. What guarantees does the HWM provide?
- What configuration parameters affect durability? (`acks`, `min.insync.replicas`, `unclean.leader.election.enable`.)
- How do you scale a Kafka topic? (Add partitions — but think about ordering and consumer group rebalance.)
- How does Kafka handle consumer offset management?
- What is exactly-once semantics in Kafka? (Idempotent producer + transactions across producer-consumer-producer pattern.)
- Kafka vs RabbitMQ: when would you choose each?

### RabbitMQ
- Explain the exchange types: direct, topic, fanout, headers.
- How do you implement delayed messages in RabbitMQ? (TTL + DLX, or the delayed-exchange plugin.)
- Walk through how a message moves from producer to consumer.
- How do you make RabbitMQ persistence reliable? (Durable exchange, durable queue, persistent messages, publisher confirms, manual ack on consume.)

### RocketMQ
*(Very common in China interviews)*
- Compare RocketMQ and Kafka.
- Why did RocketMQ implement its own NameServer instead of using ZooKeeper?
- Explain RocketMQ's CommitLog, ConsumeQueue, IndexFile.
- How does RocketMQ implement transactional messages?
- How does RocketMQ implement delayed messages? (Predefined delay levels.)
- Explain push vs pull consumption in RocketMQ.

---

## System design
*(Very heavy in US market; growing in China market)*

### Process / approach
- Walk through how you'd approach a system-design question. (Clarify requirements → estimate scale → API design → high-level architecture → data model → deep-dive on bottlenecks → tradeoffs.)
- How do you do back-of-envelope estimation? (Latency numbers, storage sizes, RPS / QPS.)
- What is the CAP theorem? Give a concrete example for each pair (CP, AP, CA).
- What is PACELC and how does it refine CAP?
- Explain eventual consistency. Give a real-world example that's acceptable; one where it's not.
- What are common SLA / SLO / SLI definitions? What's an error budget?

### Specific design problems
For each of these, you should be able to design end-to-end in 45 minutes:
- Design a URL shortener (TinyURL / Bitly).
- Design a rate limiter as a distributed service.
- Design a notification system (email / SMS / push).
- Design Twitter / a Twitter feed timeline.
- Design WhatsApp / a chat system with delivery + read receipts.
- Design YouTube / a video-streaming platform.
- Design Uber / a ride-matching service.
- Design Dropbox / a file-sync service.
- Design a payment system (with idempotency, retries, settlement).
- Design a flash-sale / seckill system (high write contention, fairness).
- Design a search system (typeahead / full-text).
- Design a recommendation system.
- Design a distributed key-value store (like DynamoDB / Cassandra).
- Design a metrics / monitoring system.

### Building blocks to know
- Load balancers — L4 vs L7, algorithms (round-robin, least connections, IP hash), health checks
- Caching layers — local vs distributed, write strategies, invalidation
- Sharding — range, hash, consistent hash; choosing a key
- Replication — leader-follower vs multi-leader vs leaderless
- Message queues — Kafka, RabbitMQ, SQS
- Object storage — S3, GCS, B2, R2
- Search — Elasticsearch / OpenSearch
- CDN — CloudFront, Cloudflare, Akamai
- API gateways — Kong, Envoy, Spring Cloud Gateway
- Service discovery — Consul, etcd, Eureka, Kubernetes DNS
- Distributed transactions — 2PC, Saga, TCC, outbox pattern
- Idempotency keys
- Circuit breakers (Resilience4j, Sentinel)

### Distributed systems concepts
- What is a leader election? Name two algorithms (Raft, Paxos, ZAB).
- Explain Raft at a high level. (Leader election + log replication + safety.)
- Explain consistent hashing. Why is it used over modulo hashing?
- Why is "exactly-once" generally a lie? Where do people actually mean "effectively-once via idempotency"?
- What is the outbox pattern and what problem does it solve?
- How do you handle thundering-herd / cache stampede?
- How do you handle hot keys?
- What is backpressure and how does it propagate through a system?

---

## Spring / web framework internals
*(China market: heavy. US market: less so, but Spring-specific roles ask deeply)*

- What is IoC / DI? What problem does it solve?
- Difference between `@Autowired`, `@Resource`, `@Inject`.
- Difference between `@Component`, `@Service`, `@Repository`, `@Controller`.
- Walk through the Spring Bean lifecycle.
- What are the bean scopes? (singleton, prototype, request, session, application, websocket.)
- Are singleton beans thread-safe? (No, not inherently — the singleton refers to the container managing one instance, not to thread safety.)
- What design patterns does Spring use heavily? (Factory, proxy, template method, observer, strategy, decorator.)
- How does Spring AOP work? (JDK dynamic proxy for interface-based; CGLIB for class-based.) When does each apply?
- How does `@Transactional` work? When is a transaction NOT applied? (Self-invocation through `this`, non-public methods by default, exception is checked and not rolled back unless declared.)
- How does Spring Boot's auto-configuration work? (`@EnableAutoConfiguration` → `META-INF/spring.factories` or `AutoConfiguration.imports` → conditional beans.)
- How would you write a custom Spring Boot starter?
- How do you handle exceptions globally in Spring MVC? (`@ControllerAdvice` + `@ExceptionHandler`.)
- How does Spring resolve circular dependencies? (Three-level cache for singleton scope — but only setter / field injection; constructor cycles still fail.)
- What is the difference between `BeanFactory` and `ApplicationContext`?
- Compare Spring Security and Apache Shiro.

### MyBatis
*(China market: very common)*
- How does MyBatis implement lazy loading?
- Explain MyBatis's first-level and second-level cache.
- Difference between `#{}` and `${}` in MyBatis SQL. Why is `${}` risky?
- How does MyBatis convert a Mapper interface into a runtime implementation? (JDK dynamic proxy.)
- How would you implement a plugin (interceptor) in MyBatis?

---

## Microservices and architecture

- What is a microservice? When should you NOT use microservices?
- What problems does a service registry solve? Compare Eureka, Consul, Nacos, ZooKeeper.
- What is an API gateway? What functions does it perform? (Routing, auth, rate limiting, transformation, observability.)
- Explain circuit breaker, retry, bulkhead, fallback. When does each apply?
- What is service mesh? When do you need one? (Istio, Linkerd.)
- How do you handle distributed tracing? (OpenTelemetry, Jaeger, Zipkin — request gets a trace ID, propagated through all calls.)
- How do you handle configuration in a microservice fleet? (Spring Cloud Config, Consul, Nacos, etcd, AWS Parameter Store.)
- Domain-driven design at a high level: bounded contexts, aggregates, entities vs value objects. How do you decide service boundaries?
- What is Conway's Law and what's the implication for service design?
- How do you do canary deploys? Blue-green deploys? Feature flags?

---

## Operating systems

- Process vs thread vs coroutine. Why is a thread context switch cheaper than a process switch?
- What is a deadlock? Four conditions for it.
- What is a race condition? Show a minimal example.
- Explain mutex, semaphore, monitor.
- What is virtual memory? What problem does it solve?
- Explain paging. What is a page fault?
- Compare process scheduling algorithms (FCFS, SJF, round-robin, priority, multilevel feedback).
- What's the difference between user mode and kernel mode? What is a system call?
- Explain the I/O models: blocking I/O, non-blocking I/O, I/O multiplexing (`select`, `poll`, `epoll`), signal-driven I/O, asynchronous I/O.
- How does `epoll` work? Why is it more efficient than `select` and `poll`?
- What is zero-copy? How does Kafka use it?

---

## Networking

- Walk through what happens when you type a URL and press Enter. (DNS → TCP handshake → TLS handshake → HTTP request → server processing → response → render.)
- Difference between TCP and UDP. When do you choose UDP?
- Why does TCP need a three-way handshake? Why does close need four?
- What is TIME_WAIT? Why does it exist?
- Explain TCP congestion control at a high level. (Slow start, congestion avoidance, fast retransmit, fast recovery; modern algorithms: CUBIC, BBR.)
- Difference between HTTP/1.0, HTTP/1.1, HTTP/2, HTTP/3.
- How does HTTPS work? Walk through the TLS handshake.
- Compare symmetric vs asymmetric encryption. Why does TLS use both?
- What is a CDN? How does it help?
- Difference between cookie and session.
- What is CORS and why does it exist? What's a preflight request?
- What is JWT? What are its tradeoffs vs server-side sessions?
- Common attacks: SQL injection, XSS, CSRF — explain each and the defenses.

---

## Containers / DevOps

- What's the difference between a container and a VM? (Shared kernel, lighter, faster startup.)
- What is a Docker image vs container? Where does the image live? (Layered file system, registry.)
- What does multi-stage Docker build solve?
- What is `.dockerignore` and why does it matter?
- What does Kubernetes solve that plain Docker doesn't? (Scheduling, self-healing, service discovery, scaling, rolling deploys.)
- Compare Deployment, StatefulSet, DaemonSet, Job, CronJob.
- What's the difference between a Service and an Ingress? Service types (ClusterIP / NodePort / LoadBalancer)?
- What are liveness and readiness probes? When does each apply?
- A Pod is stuck in `CrashLoopBackOff`. How do you debug?
- A Pod is `Pending`. How do you debug?
- What are ConfigMaps and Secrets? When do you use which?
- Difference between `kubectl apply` and `kubectl create`.

---

## Behavioral
*(US market in particular: expect 30–60 minutes of behavioral across the loop)*

For each, prepare a 2-minute STAR story:
- Tell me about yourself.
- Why are you leaving your current job / why do you want to join us?
- Tell me about a time you disagreed with a teammate.
- Tell me about a time you took initiative beyond your assigned work.
- Tell me about a time you had to deliver under a tight deadline.
- Tell me about a time you failed. (Don't pick something trivial; show actual reflection.)
- Tell me about a time you received tough feedback.
- Tell me about a time you mentored someone.
- Tell me about the most technically challenging project you've worked on.
- Tell me about a time you had to make a decision with incomplete information.
- How do you handle being assigned work you don't enjoy?
- How do you prioritize when everything is "urgent"?

### Amazon-specific (leadership principles)
Amazon's loop is built around the 16 Leadership Principles. The most heavily tested:
- Customer Obsession
- Ownership
- Invent and Simplify
- Are Right, A Lot
- Learn and Be Curious
- Hire and Develop the Best
- Insist on the Highest Standards
- Think Big
- Bias for Action
- Deliver Results

Have at least one story per principle, ideally two.

### Questions to ask interviewers (don't skip)
- What does a typical day look like for an engineer on this team?
- What's the biggest engineering challenge the team is solving?
- How do you measure success at 3 / 6 / 12 months in this role?
- How is technical disagreement handled?
- What's the on-call rotation like?
- What's something you wish someone had told you before joining?
- Why did you join, and what's kept you here?

---

## Algorithms and coding
*(US market — central. China market — common, often slightly easier problems but with code-quality emphasis)*

These are the patterns that dominate coding interviews. Be fluent in each:

### Patterns
- **Two pointers** — sorted-array problems, partitioning
- **Sliding window** — substring / subarray with constraint
- **Fast and slow pointers** — cycle detection, middle of linked list
- **Prefix sums** — range-sum queries
- **Binary search** — and binary search "on the answer"
- **BFS / DFS** — trees and graphs
- **Backtracking** — combinations, permutations, N-queens, sudoku
- **Dynamic programming** — 1D (Fibonacci-like, coin change, climbing stairs), 2D (grid path, LCS, edit distance), knapsack variants
- **Greedy** — interval scheduling, jump game
- **Heap / priority queue** — top-K, k-way merge, scheduling
- **Trie** — prefix matching, autocomplete
- **Union-find (DSU)** — connectivity, Kruskal's MST
- **Topological sort** — course schedule, build order
- **Dijkstra / Bellman-Ford** — shortest path
- **Bit manipulation** — set bits, XOR tricks
- **Monotonic stack / deque** — next greater element, sliding-window max

### Highly frequent problems
- Two Sum
- Three Sum
- Reverse a Linked List (iterative + recursive)
- Detect Cycle in Linked List (Floyd's)
- Merge Two Sorted Lists / K Sorted Lists
- Valid Parentheses
- Longest Substring Without Repeating Characters
- Longest Palindromic Substring
- Container With Most Water
- Trapping Rain Water
- Maximum Subarray (Kadane's)
- Best Time to Buy and Sell Stock (I, II, III, IV)
- Climbing Stairs
- Coin Change (min coins + number of ways)
- House Robber (I, II)
- Word Break
- Edit Distance
- LRU Cache (`LinkedHashMap` or hash map + doubly linked list)
- LFU Cache
- Serialize / Deserialize Binary Tree
- Lowest Common Ancestor of a Binary Tree
- Validate BST
- Number of Islands
- Word Ladder
- Course Schedule (I, II — topological sort)
- Top K Frequent Elements
- Median of Two Sorted Arrays
- Find Kth Largest in Array (quickselect, heap)
- Search in Rotated Sorted Array
- Regular Expression / Wildcard Matching
- Sliding Window Maximum

### Coding interview etiquette
1. Restate the problem. Ask 1–2 clarifying questions (input range, edge cases, allowed memory).
2. Discuss approaches verbally before coding. Start with brute force, state its complexity, then improve.
3. State the complexity of the chosen approach.
4. Write clean code. Name variables meaningfully. Use small helper functions.
5. Run through the code with a small example as if you were the JVM.
6. Discuss edge cases: empty input, one element, all duplicates, negative numbers, integer overflow.
7. Mention testing strategy and known limitations.

### Resources for practice
- **LeetCode** ([leetcode.com](https://leetcode.com)) — the standard. Free tier is enough.
- **NeetCode** ([neetcode.io](https://neetcode.io)) — curated 150 / 250 problem lists with high-quality video explanations.
- **Grind 75 / Blind 75** — shorter curated lists for time-constrained prep.
- **Cracking the Coding Interview** (book by Gayle Laakmann McDowell) — classic.
- **Elements of Programming Interviews** (book) — harder, language-specific (Java / Python / C++ versions).
- **Hello Interview** ([hellointerview.com](https://www.hellointerview.com)) — paid system-design + mocks.
- **Pramp** — free peer mock interviews.
- **interviewing.io** — paid mocks with engineers at top companies; has free anonymous practice.
- **Codeforces / AtCoder** — competitive programming practice if you want sharper algorithm chops.
- **(China market)** **牛客网 (Nowcoder)** — the dominant interview prep site in China, with company-specific question banks.

---

## Final notes

**Interview difficulty calibration**:
- US Big Tech: hardest LeetCode, hardest system design, full behavioral.
- US mid-size tech: medium LeetCode, system design at the relevant level, behavioral.
- US non-tech-company tech roles (finance, healthcare): often easier on algorithms, harder on practical SQL / domain knowledge.
- US startup: more take-home + practical; less LeetCode (varies hugely).
- China 大厂: heavy Java internals + JVM + framework source + algorithms + system design.
- China 中厂: lighter on internals, heavier on hands-on Spring / MyBatis / Redis / MQ experience.

**What separates passing candidates from "no hires"**:
1. Communication. Verbalize your thought process. Silent thinking + sudden code is a bad signal.
2. Honesty about uncertainty. "I'm not sure, but here's what I'd try" beats confident wrong answers.
3. Cleanness of code under pressure. Names, structure, edge cases — not just "tests pass".
4. Curiosity. Asking good clarifying questions and good questions back.
5. Calm. The interviewer is observing how you'd be in real engineering work. Stress, defensiveness, and brittleness all read.

The skills here aren't tricks. They overlap heavily with what makes someone good at the actual job. Treat interview prep as engineer-development with a deadline, and you'll come out a better engineer regardless of which offer you take.
