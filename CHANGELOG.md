#### 5.1.1 (2026-09-04)

##### Chores

* **SYN-633:**
  *  harden the release workflows per code review ([0cd3e758](https://github.com/lob/hapi-bookshelf-total-count/commit/0cd3e758176682dbf1946c1534389d5173b5865d))
  *  replace release-please with PR-then-publish, keeping the original manual patch/minor/major workflow ([188448f0](https://github.com/lob/hapi-bookshelf-total-count/commit/188448f0cb5812e3a232f6c13dfa46caf4dc1a4b))
  *  add .npmignore to stop shipping CI config, tests, and lint config to npm ([fa33b470](https://github.com/lob/hapi-bookshelf-total-count/commit/fa33b470e3b5dbc14c412de7fdd4775273b34924))
  *  fix release-please tag naming to match existing v-prefixed tags ([529b7502](https://github.com/lob/hapi-bookshelf-total-count/commit/529b7502e6fdbd75316c55f463ad6f9bfee2f844))
  *  replace manual npm publish workflow with release-please ([0cf76c33](https://github.com/lob/hapi-bookshelf-total-count/commit/0cf76c338e936b33d76f3b3076354144438098e2))

##### Documentation Changes

* **SYN-633:**  document the Conventional Commits / squash-title requirement in-repo ([be0839c9](https://github.com/lob/hapi-bookshelf-total-count/commit/be0839c91761b1680fc1474c50018b875663bed9))

##### Bug Fixes

* **SYN-633:**  retroactively mark the dependency vuln fix as release-worthy ([abbc02a1](https://github.com/lob/hapi-bookshelf-total-count/commit/abbc02a1b570ca7cd6624b0109b8d918e1a57623))

##### Other Changes

*  bring v5.1.0 tag into ancestry ([5483697f](https://github.com/lob/hapi-bookshelf-total-count/commit/5483697f93d6b70fade7749850a56055e1a8d541))
*  Clear all high-severity npm audit findings ([#51](https://github.com/lob/hapi-bookshelf-total-count/pull/51)) ([5b108eb9](https://github.com/lob/hapi-bookshelf-total-count/commit/5b108eb94ad93135df92366e2dc34007847c0fbd))

### 5.1.0 (2025-11-12)

### 5.0.0 (2024-09-16)

* Update to use [@hapi/hapi](https://www.npmjs.com/package/@hapi/hapi) package, replaces deprecated [hapi](https://www.npmjs.com/package/hapi) package in peer dependencies.

#### BREAKING CHANGES

* Dropped support for deprecated [hapi](https://www.npmjs.com/package/hapi) package

### 4.3.0 (2019-07-24)

##### Chores

* **deps:**  Bump dependency versions to sync with lob-api ([8b79407a](https://github.com/lob/hapi-bookshelf-total-count/commit/8b79407a41babaec77debc9d740144c9bca83c78))

### 4.2.0 (2019-07-24)

##### Chores

* **versions:**  Move Joi to a peer dependency ([6afb8119](https://github.com/lob/hapi-bookshelf-total-count/commit/6afb8119d397274c147ae7b950c50c8d18423c88))

### 4.1.0 (2018-09-18)

##### New Features

* **include_flag:**
  *  upgrade node version and set explicit hapi version ([45fb9e88](https://github.com/lob/hapi-bookshelf-total-count/commit/45fb9e8820fca3612a6d07b335886642d12bfdd0))
  *  add flag to restrict counts computed from the plugin ([94864d65](https://github.com/lob/hapi-bookshelf-total-count/commit/94864d651a07b4c1be524e4462ff0e67c929fefc))

##### Bug Fixes

* **total_count_performance:**  update readme ([c124eb80](https://github.com/lob/hapi-bookshelf-total-count/commit/c124eb80ec2cac77708efd214214e12a28774f33))

## 4.0.0 (2016-10-31)

##### New Features

* **redis:** removes dependence on then-redis ([0b4ddb0a](https://github.com/lob/hapi-bookshelf-total-count/commit/0b4ddb0ad93685b089087c80bc35eafdc393dca9))

## 3.0.0 (2016-9-22)

##### New Features

* **cache:** adds caching with approximate_count ([f22395c5](https://github.com/lob/hapi-bookshelf-total-count/commit/f22395c5648196d0f2fdbc69ccb2e953d6dfe150))

## 2.0.0 (2016-6-20)

##### Chores

* **hapi-qs:** added hapi-qs as peer-dependency ([7720b887](https://github.com/lob/hapi-bookshelf-total-count/commit/7720b887b8923d4d365b65d3deed4e5da505b501))
* **deps:** upgrade eslint-config-lob to 2.0.1 ([d1a5635f](https://github.com/lob/hapi-bookshelf-total-count/commit/d1a5635f2747e5eea77f44c02ceaf17b8de8229b))

## 1.0.0 (2016-4-7)

##### Documentation Changes

* **readme:** add usage instructions and examples ([cad00ecf](https://github.com/lob/hapi-bookshelf-total-count/commit/cad00ecf9b98d46b5c5027a6e4679045e0318a4d))

##### New Features

* **plugin:** create total count plugin ([584f0e58](https://github.com/lob/hapi-bookshelf-total-count/commit/584f0e5848dc6db5056c67966e0efb06fd5776e5))

