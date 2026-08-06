# Billing Pipeline

Mermaid transcription of the billing pipeline DAG.

- **Solid black arrows** — task dependencies (control flow)
- **Dotted green arrows** — S3 data flow (`run_attributes`, `assets`, `billing`)
- **Dotted blue arrows** — Snowflake data flow (`CARI & UNIT_COMMERCIAL_METRICS`, `RENUMERATION_*`)

```mermaid
flowchart TB
    %% ---------- Pipeline boundaries ----------
    start(("start_billing<br/>_pipeline"))
    finish(("end_billing_<br/>pipeline"))

    %% ---------- Tasks ----------
    check_comm["check_commissioning_inconsistency"]
    check_share["check_share_inconsistency"]
    export_dbb["export_renumeration_to_dbb"]
    gen_pay["generation_payment"]
    det_bill["detailed_billing"]
    win_sum["windows_summary"]
    redis_pay["redispatch_payment"]
    overview["overview"]
    zip_res["zip_billing_results"]

    %% ---------- External systems ----------
    s3_main["S3"]
    s3_assets["S3"]
    sf_src["Snowflake"]
    sf_tgt["Snowflake"]

    %% ---------- Control flow: fan-out from start ----------
    start --> check_comm
    start --> check_share
    start --> gen_pay
    start --> det_bill
    start --> win_sum
    start --> redis_pay
    start --> export_dbb
    start --> zip_res

    %% ---------- Control flow: billing task chain ----------
    gen_pay --> det_bill
    det_bill --> win_sum
    win_sum --> redis_pay

    %% ---------- Control flow: fan-in to overview ----------
    gen_pay --> overview
    det_bill --> overview
    win_sum --> overview
    redis_pay --> overview

    %% ---------- Control flow: fan-in to zip and end ----------
    overview --> zip_res
    export_dbb --> zip_res
    zip_res --> finish

    %% ---------- S3 data flow ----------
    start -. "run_attributes" .-> s3_main
    finish -. "run_attributes" .-> s3_main

    s3_assets -. "assets" .-> gen_pay
    s3_assets -. "assets" .-> win_sum
    s3_assets -. "assets" .-> redis_pay

    gen_pay -. "billing" .-> s3_main
    det_bill -. "billing" .-> s3_main
    win_sum -. "billing" .-> s3_main
    redis_pay -. "billing" .-> s3_main
    overview -. "billing" .-> s3_main
    zip_res -. "billing" .-> s3_main
    s3_main -. "billing" .-> zip_res

    %% ---------- Snowflake data flow ----------
    sf_src -. "CARI & UNIT_COMMERCIAL_METRICS" .-> check_comm
    sf_src -. "CARI & UNIT_COMMERCIAL_METRICS" .-> export_dbb
    export_dbb -. "RENUMERATION_CUSTOMER &<br/>RENUMERATION_GRID_OPERATOR" .-> sf_tgt

    %% ---------- Styling ----------
    classDef s3 fill:#00A650,stroke:#000,stroke-width:1px,color:#000;
    classDef snowflake fill:#00AEEF,stroke:#000,stroke-width:1px,color:#000;
    classDef task fill:#FFFFFF,stroke:#000,stroke-width:1px,color:#000;
    classDef boundary fill:#FFFFFF,stroke:#000,stroke-width:1px,color:#000;

    class s3_main,s3_assets s3;
    class sf_src,sf_tgt snowflake;
    class check_comm,check_share,export_dbb,gen_pay,det_bill,win_sum,redis_pay,overview,zip_res task;
    class start,finish boundary;

    %% S3 (green) data links
    linkStyle 18,19,20,21,22,23,24,25,26,27,28,29 stroke:#8CC63F,stroke-width:1.5px;
    %% Snowflake (blue) data links
    linkStyle 30,31,32 stroke:#00AEEF,stroke-width:1.5px;
```

## Flow summary

### Control flow

| Task | Upstream dependencies |
| --- | --- |
| `check_commissioning_inconsistency` | `start_billing_pipeline` |
| `check_share_inconsistency` | `start_billing_pipeline` |
| `export_renumeration_to_dbb` | `start_billing_pipeline` |
| `generation_payment` | `start_billing_pipeline` |
| `detailed_billing` | `start_billing_pipeline`, `generation_payment` |
| `windows_summary` | `start_billing_pipeline`, `detailed_billing` |
| `redispatch_payment` | `start_billing_pipeline`, `windows_summary` |
| `overview` | `generation_payment`, `detailed_billing`, `windows_summary`, `redispatch_payment` |
| `zip_billing_results` | `start_billing_pipeline`, `overview`, `export_renumeration_to_dbb` |
| `end_billing_pipeline` | `zip_billing_results` |

### Data flow

| Source | Dataset | Target |
| --- | --- | --- |
| `start_billing_pipeline` | `run_attributes` | S3 |
| `end_billing_pipeline` | `run_attributes` | S3 |
| S3 | `assets` | `generation_payment`, `windows_summary`, `redispatch_payment` |
| `generation_payment`, `detailed_billing`, `windows_summary`, `redispatch_payment`, `overview`, `zip_billing_results` | `billing` | S3 |
| S3 | `billing` | `zip_billing_results` |
| Snowflake | `CARI` & `UNIT_COMMERCIAL_METRICS` | `check_commissioning_inconsistency`, `export_renumeration_to_dbb` |
| `export_renumeration_to_dbb` | `RENUMERATION_CUSTOMER` & `RENUMERATION_GRID_OPERATOR` | Snowflake |
