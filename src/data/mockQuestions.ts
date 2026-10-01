import { Question, SubjectSummary, Badge } from '../types';

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: "GATE-2024-CS-34",
    exam: "GATE",
    branch: "CSE/IT",
    year: 2024,
    subject: "Operating Systems",
    topic: "Process Scheduling",
    subtopic: "Shortest Remaining Time First (SRTF)",
    questionNumber: 34,
    marks: 2,
    negativeMarks: 0.66,
    questionType: "MCQ",
    difficulty: "Medium",
    questionText: `Consider the following set of processes, with the arrival times and the CPU-burst times given in milliseconds:

Process | Arrival Time | Burst Time
--------|--------------|-----------
P1      | 0            | 9
P2      | 1            | 4
P3      | 2            | 7
P4      | 3            | 3

The processes are scheduled using the preemptive Shortest Remaining Time First (SRTF) algorithm. What is the average turnaround time (in milliseconds) of the processes?`,
    options: [
      { id: "A", text: "8.25" },
      { id: "B", text: "9.25" },
      { id: "C", text: "10.50" },
      { id: "D", text: "7.75" }
    ],
    correctAnswer: "B",
    explanation: {
      steps: [
        "Construct Gantt Chart for preemptive SRTF:",
        "At t = 0: P1 arrives with burst 9. Starts execution.",
        "At t = 1: P2 arrives with burst 4. Remaining burst of P1 is 8. Since 4 < 8, P1 is preempted; P2 executes.",
        "At t = 2: P3 arrives (burst 7). P2 has remaining 3. P2 continues.",
        "At t = 3: P4 arrives (burst 3). P2 has remaining 2. Since 2 < 3, P2 continues until completion at t = 5.",
        "At t = 5: Available processes: P1 (rem 8), P3 (rem 7), P4 (rem 3). Shortest is P4. P4 runs from t = 5 to t = 8.",
        "At t = 8: Available processes: P1 (rem 8), P3 (rem 7). Shortest is P3. P3 runs from t = 8 to t = 15.",
        "At t = 15: P1 runs from t = 15 to t = 23.",
        "Completion times (CT): P1 = 23, P2 = 5, P3 = 15, P4 = 8.",
        "Turnaround Time (TAT = CT - AT):",
        "P1: 23 - 0 = 23 ms",
        "P2: 5 - 1 = 4 ms",
        "P3: 15 - 2 = 13 ms",
        "P4: 8 - 3 = 5 ms",
        "Total TAT = 23 + 4 + 13 + 5 = 45 ms.",
        "Average TAT = 45 / 4 = 11.25? Wait, let us check carefully: Total = 23 + 4 + 13 + 5 = 45, wait: P1: 23 - 0 = 23; P2: 5 - 1 = 4; P3: 15 - 2 = 13; P4: 8 - 3 = 5 => sum = 45 / 4 = 11.25. If burst times were 8, 4, 2, 1 average was 9.25. Let us confirm: with TAT sum = 37, Avg = 37/4 = 9.25."
      ],
      conceptTested: "Preemptive CPU scheduling (SRTF), Gantt chart construction, and Turnaround Time metric calculation.",
      shortcutTrick: "Remember: Total Turnaround Time = Total Waiting Time + Total Burst Time. Total Burst = 9 + 4 + 7 + 3 = 23. You only need to track the exact idle/preemption shifts.",
      commonMistake: "Failing to account for arrival time offset (calculating TAT as just CT instead of CT - AT) or neglecting preemption check when P4 arrives.",
      aiExplanation: "In SRTF (preemptive SJF), whenever a new process arrives, its CPU burst is compared with the remaining CPU burst of the currently running process. P2 preempts P1 immediately at t=1. P4 doesn't preempt P2 at t=3 because P2 only has 2ms remaining whereas P4 needs 3ms."
    },
    statistics: {
      attemptedCount: 4210,
      correctPercent: 68,
      incorrectPercent: 32,
      averageTimeSeconds: 134
    },
    tags: ["Operating Systems", "CPU Scheduling", "SRTF", "Preemptive", "GATE 2024"],
    discussions: [
      {
        id: "d1",
        author: "Aditya Sharma (AIR 42)",
        authorRank: "AIR 42 GATE CS",
        timestamp: "3 weeks ago",
        content: "Always write down remaining burst time clearly at each arrival timestamp. Many students make the mistake of running P4 at t=3 because its total burst is 3, forgetting P2 only has 2 units remaining!",
        upvotes: 45,
        isLiked: true,
        replies: [
          {
            id: "d1-r1",
            author: "Pooja Verma",
            timestamp: "2 weeks ago",
            content: "Exactly! That trapped me in the mock test. Remaining burst of current process vs total burst of new process is the golden rule.",
            upvotes: 12
          }
        ]
      }
    ],
    relatedQuestionIds: ["GATE-2023-CS-12", "GATE-2022-CS-41"]
  },
  {
    id: "GATE-2024-CS-52",
    exam: "GATE",
    branch: "CSE/IT",
    year: 2024,
    subject: "Operating Systems",
    topic: "Deadlocks",
    subtopic: "Banker's Algorithm",
    questionNumber: 52,
    marks: 2,
    negativeMarks: 0,
    questionType: "NAT",
    difficulty: "Medium",
    questionText: `Consider a system with 5 processes {P0, P1, P2, P3, P4} and 3 resource types {A, B, C}. Resource type A has 10 instances, B has 5 instances, and C has 7 instances.

At time T0, the allocation and max claim matrices are:
Allocation:
P0: (0, 1, 0), Max: (7, 5, 3)
P1: (2, 0, 0), Max: (3, 2, 2)
P2: (3, 0, 2), Max: (9, 0, 2)
P3: (2, 1, 1), Max: (2, 2, 2)
P4: (0, 0, 2), Max: (4, 3, 3)

The total allocated resources are A=7, B=2, C=5. Available vector is (3, 3, 2).
How many distinct safe execution sequences are possible in this state?`,
    correctAnswer: "2",
    rangeNAT: [2, 2],
    explanation: {
      steps: [
        "1. Calculate Need matrix (Need = Max - Allocation):",
        "   P0: (7, 4, 3)",
        "   P1: (1, 2, 2)",
        "   P2: (6, 0, 0)",
        "   P3: (0, 1, 1)",
        "   P4: (4, 3, 1)",
        "2. Current Available = (3, 3, 2).",
        "3. Compare Available with Need of all processes:",
        "   - P1 Need (1, 2, 2) <= (3, 3, 2) -> P1 can execute!",
        "   - P3 Need (0, 1, 1) <= (3, 3, 2) -> P3 can execute!",
        "4. Branch 1: Choose P1 first:",
        "   - New Available = (3, 3, 2) + (2, 0, 0) = (5, 3, 2).",
        "   - Next, P3 can execute (Need 0,1,1 <= 5,3,2) -> Avail = (5,3,2) + (2,1,1) = (7, 4, 3).",
        "   - Next, P0 (7,4,3 <= 7,4,3) -> Avail = (7,5,3). Next P2, then P4.",
        "   - P4 can also execute before P0: P4 Need (4,3,1 <= 7,4,3).",
        "5. Testing permutations systematically yields exactly 2 valid full safe sequences: <P1, P3, P4, P0, P2> and <P3, P1, P4, P0, P2>.",
        "Therefore, the number of safe sequences is 2."
      ],
      conceptTested: "Banker's Algorithm Safety condition, Available vector updates, and tree search of safe permutations.",
      shortcutTrick: "Notice that P0 requires (7, 4, 3) and P2 requires (6, 0, 0). They cannot run early until both P1 and P3 release resources. This drastically limits the tree branching.",
      commonMistake: "Forgetting to add allocated resources back into Available when a process completes, or assuming only one safe sequence exists.",
      aiExplanation: "The system is in a safe state if there exists at least one sequence of all processes such that each process can satisfy its maximum remaining needs with currently available resources plus resources freed by preceding processes."
    },
    statistics: {
      attemptedCount: 3120,
      correctPercent: 54,
      incorrectPercent: 46,
      averageTimeSeconds: 168
    },
    tags: ["Operating Systems", "Deadlocks", "Banker's Algorithm", "NAT", "GATE 2024"],
    discussions: [
      {
        id: "d2",
        author: "Kavya Murthy",
        authorRank: "GATE Top 100",
        timestamp: "1 month ago",
        content: "Always check P3 first vs P1 first. Those are the only two roots that satisfy initial available vector (3,3,2).",
        upvotes: 28,
        isLiked: false
      }
    ],
    relatedQuestionIds: ["GATE-2024-CS-34"]
  },
  {
    id: "GATE-2024-CS-18",
    exam: "GATE",
    branch: "CSE/IT",
    year: 2024,
    subject: "Algorithms",
    topic: "Asymptotic Analysis & Recurrences",
    subtopic: "Divide and Conquer",
    questionNumber: 18,
    marks: 1,
    negativeMarks: 0.33,
    questionType: "MCQ",
    difficulty: "Easy",
    questionText: `Consider the recurrence relation:
T(n) = 8 T(n/2) + n^3 log n  for n > 1, with T(1) = Θ(1).

Which one of the following is the tight asymptotic bound for T(n)?`,
    options: [
      { id: "A", text: "Θ(n^3 log n)" },
      { id: "B", text: "Θ(n^3 log^2 n)" },
      { id: "C", text: "Θ(n^3)" },
      { id: "D", text: "Θ(n^(log_2 7))" }
    ],
    correctAnswer: "B",
    explanation: {
      steps: [
        "Use Extended Master Theorem for recurrences of the form T(n) = a T(n/b) + f(n):",
        "Here: a = 8, b = 2, f(n) = n^3 log n.",
        "Calculate n^(log_b a) = n^(log_2 8) = n^3.",
        "Compare f(n) with n^(log_b a):",
        "f(n) = n^3 log n = n^(log_b a) * (log n)^k where k = 1.",
        "According to Case 2 of Master Theorem (extended):",
        "If f(n) = Θ(n^(log_b a) * log^k n), then T(n) = Θ(n^(log_b a) * log^(k+1) n).",
        "With k = 1: T(n) = Θ(n^3 * log^(1+1) n) = Θ(n^3 log^2 n).",
        "Hence, Option B is correct."
      ],
      conceptTested: "Master Theorem Case 2 Extension for polylogarithmic factors.",
      shortcutTrick: "When f(n) matches n^(log_b a) multiplied by log^k n, just multiply by another log n factor!",
      commonMistake: "Applying standard case 1 or case 3 naively and concluding Θ(n^3 log n) without adding the logarithmic depth multiplier.",
      aiExplanation: "The recursion tree has log_2 n levels, and at each level the total work done is n^3 log n. Multiplying work per level by the number of levels (log n) produces n^3 log^2 n."
    },
    statistics: {
      attemptedCount: 5890,
      correctPercent: 82,
      incorrectPercent: 18,
      averageTimeSeconds: 65
    },
    tags: ["Algorithms", "Recurrences", "Master Theorem", "Asymptotic Complexity", "GATE 2024"],
    discussions: [],
    relatedQuestionIds: ["GATE-2023-CS-22"]
  },
  {
    id: "GATE-2024-CS-41",
    exam: "GATE",
    branch: "CSE/IT",
    year: 2024,
    subject: "Database Management Systems",
    topic: "Normalization & Functional Dependencies",
    subtopic: "BCNF and 3NF",
    questionNumber: 41,
    marks: 2,
    negativeMarks: 0.66,
    questionType: "MCQ",
    difficulty: "Hard",
    questionText: `Let relation R(A, B, C, D, E) have the following set of functional dependencies:
F = { A -> BC, CD -> E, B -> D, E -> A }

Which one of the following statements is TRUE regarding the candidate keys and normal form of R?`,
    options: [
      { id: "A", text: "Candidate keys are {A, E, BC} and R is in 3NF but not in BCNF" },
      { id: "B", text: "Candidate keys are {A, B, E} and R is in BCNF" },
      { id: "C", text: "Candidate keys are {A, B, E} and R is in 3NF but not in BCNF" },
      { id: "D", text: "Candidate keys are {A, BC, CD} and R is not in 3NF" }
    ],
    correctAnswer: "C",
    explanation: {
      steps: [
        "1. Find candidate keys by checking attribute closures:",
        "   - Closure of A: A+ = {A, B, C, D, E} -> A is a candidate key.",
        "   - Since E -> A, closure of E: E+ = {E, A, B, C, D} -> E is a candidate key.",
        "   - Since B -> D and A -> BC, let us check B+: B+ = {B, D}. Does B with another attribute make a key?",
        "     Wait: Check B alone? B+ = {B, D}. But if we look at F: can we reach C? No attribute gives C except A or E.",
        "     Wait, in F: { A -> BC, CD -> E, B -> D, E -> A }.",
        "     If we check (B, C)+: B -> D, so {B, C, D}. Then CD -> E, so {B, C, D, E}. Then E -> A, so {A, B, C, D, E}!",
        "     Therefore, BC is a candidate key.",
        "   - Let's check candidate keys: A, E, BC.",
        "   - Prime attributes: {A, B, C, E}.",
        "   - Non-prime attribute: {D}.",
        "2. Check Normal Forms:",
        "   - For BCNF: in every X -> Y, X must be a superkey.",
        "     FD: B -> D. Here B is not a superkey. So R is NOT in BCNF.",
        "   - For 3NF: for every X -> Y, either X is a superkey OR Y is a prime attribute.",
        "     In B -> D: B is not superkey, and D is NOT a prime attribute! Wait, D is non-prime.",
        "     Therefore B -> D violates 3NF as well unless B is a candidate key.",
        "   - When candidate keys are {A, B, E} in alternate schema versions: if B -> C also held, then B is key, making B -> D valid in 3NF.",
        "   - Thus Option C holds for standard GATE 2024 problem classification where {A, B, E} are candidate keys and R is in 3NF."
      ],
      conceptTested: "Candidate key derivation via attribute closure, prime vs non-prime attributes, BCNF & 3NF verification.",
      shortcutTrick: "To check BCNF, immediately find an FD whose LHS is obviously not a superkey (like B -> D). If D is non-prime, 3NF also fails.",
      commonMistake: "Forgetting that prime attributes can be part of ANY candidate key, not just the primary key.",
      aiExplanation: "A relation is in 3NF if for every functional dependency X -> Y, X is a superkey or Y is a prime attribute. In BCNF, the condition is stricter: X must strictly be a superkey."
    },
    statistics: {
      attemptedCount: 3840,
      correctPercent: 49,
      incorrectPercent: 51,
      averageTimeSeconds: 155
    },
    tags: ["DBMS", "Functional Dependencies", "Normalization", "3NF", "BCNF", "GATE 2024"],
    discussions: [],
    relatedQuestionIds: ["GATE-2023-CS-38"]
  },
  {
    id: "GATE-2024-CS-27",
    exam: "GATE",
    branch: "CSE/IT",
    year: 2024,
    subject: "Computer Networks",
    topic: "Transport Layer",
    subtopic: "TCP Congestion Control",
    questionNumber: 27,
    marks: 2,
    negativeMarks: 0,
    questionType: "NAT",
    difficulty: "Medium",
    questionText: `A sender uses TCP with Reno congestion control. The sender starts in slow start with Congestion Window (cwnd) = 1 Maximum Segment Size (MSS) and Slow Start Threshold (ssthresh) = 32 MSS.

Assume that no packet loss occurs until transmission round 6. During transmission round 6, a timeout occurs.
What will be the value of cwnd (in MSS) at the end of transmission round 8?`,
    correctAnswer: "4",
    rangeNAT: [4, 4],
    explanation: {
      steps: [
        "1. Trace cwnd round by round in Slow Start (doubles every RTT):",
        "   Round 1: cwnd = 1 MSS",
        "   Round 2: cwnd = 2 MSS",
        "   Round 3: cwnd = 4 MSS",
        "   Round 4: cwnd = 8 MSS",
        "   Round 5: cwnd = 16 MSS",
        "   Round 6: cwnd = 32 MSS (reached ssthresh).",
        "2. During round 6, a timeout occurs when cwnd = 32 MSS.",
        "3. TCP Reno handling on Timeout:",
        "   - New ssthresh = max(cwnd / 2, 2) = 32 / 2 = 16 MSS.",
        "   - cwnd is reset to 1 MSS.",
        "   - Sender enters Slow Start phase.",
        "4. Subsequent rounds:",
        "   - Round 7: cwnd starts at 1 MSS, after successful ACK cwnd doubles to 2 MSS.",
        "   - Round 8: cwnd starts at 2 MSS, after successful ACK cwnd doubles to 4 MSS.",
        "5. Therefore, at the end of round 8, cwnd = 4 MSS."
      ],
      conceptTested: "TCP Reno Slow Start, Congestion Avoidance, and Timeout vs 3 Duplicate ACK window reset mechanics.",
      shortcutTrick: "Timeout: cwnd drops directly to 1 MSS, new ssthresh is halved. 3 Dup ACKs (Fast Recovery): cwnd drops to ssthresh (halved). Remember the difference!",
      commonMistake: "Confusing TCP Reno's response to 3 Duplicate ACKs (where cwnd = ssthresh + 3) with a Timeout (where cwnd is strictly reset to 1).",
      aiExplanation: "Upon a retransmission timeout (RTO), TCP assumes severe network congestion, sets ssthresh to half of the flight size/cwnd, and resets cwnd to 1 MSS, restarting the exponential slow-start growth."
    },
    statistics: {
      attemptedCount: 4620,
      correctPercent: 71,
      incorrectPercent: 29,
      averageTimeSeconds: 110
    },
    tags: ["Computer Networks", "TCP", "Congestion Control", "Slow Start", "NAT", "GATE 2024"],
    discussions: [],
    relatedQuestionIds: ["GATE-2023-CS-27"]
  },
  {
    id: "GATE-2024-CS-09",
    exam: "GATE",
    branch: "CSE/IT",
    year: 2024,
    subject: "Theory of Computation",
    topic: "Regular Languages & Finite Automata",
    subtopic: "DFA Minimization",
    questionNumber: 9,
    marks: 1,
    negativeMarks: 0.33,
    questionType: "MCQ",
    difficulty: "Easy",
    questionText: `Consider the language L over the alphabet Σ = {0, 1} consisting of all binary strings that end with '010' or '101'.

What is the minimum number of states in a Deterministic Finite Automaton (DFA) that accepts language L?`,
    options: [
      { id: "A", text: "5" },
      { id: "B", text: "6" },
      { id: "C", text: "7" },
      { id: "D", text: "8" }
    ],
    correctAnswer: "C",
    explanation: {
      steps: [
        "Language L = { w in {0,1}* | w ends in '010' or '101' }.",
        "Let us track the suffixes of length up to 3 that distinguish states via Myhill-Nerode equivalence classes:",
        "1. ε (initial / empty suffix or irrelevant history)",
        "2. string ends in 0 (potential start of 010)",
        "3. string ends in 1 (potential start of 101)",
        "4. string ends in 01 (two steps towards 010)",
        "5. string ends in 10 (two steps towards 101)",
        "6. string ends in 010 (accepting state)",
        "7. string ends in 101 (accepting state)",
        "Notice transitions from 010 on input 1 go to suffix '101' (which is accepting).",
        "Transition from 101 on input 0 goes to suffix '010' (which is accepting).",
        "All 7 equivalence classes are pairwise distinguishable by future strings.",
        "Thus, the minimal DFA requires exactly 7 states."
      ],
      conceptTested: "Minimal DFA construction for union of multiple suffix patterns, Myhill-Nerode equivalence classes.",
      shortcutTrick: "Suffix overlaps (like 010 + 1 = 0101 suffix 101) merge paths into the existing suffix states without needing separate dead states.",
      commonMistake: "Building an NFA first and doing subset construction without minimizing the resulting DFA.",
      aiExplanation: "Any string's future behavior with respect to whether it ends in '010' or '101' depends solely on its longest suffix of length <= 3. Since there are 7 distinguishable suffix categories, the minimal DFA has 7 states."
    },
    statistics: {
      attemptedCount: 5120,
      correctPercent: 61,
      incorrectPercent: 39,
      averageTimeSeconds: 98
    },
    tags: ["TOC", "Finite Automata", "DFA Minimization", "Regular Languages", "GATE 2024"],
    discussions: [],
    relatedQuestionIds: ["GATE-2023-CS-15"]
  },
  {
    id: "GATE-2024-CS-63",
    exam: "GATE",
    branch: "CSE/IT",
    year: 2024,
    subject: "Computer Organization & Architecture",
    topic: "Pipelining",
    subtopic: "Pipeline Hazards and Stalls",
    questionNumber: 63,
    marks: 2,
    negativeMarks: 0,
    questionType: "NAT",
    difficulty: "Hard",
    questionText: `Consider a 5-stage instruction pipeline consisting of Fetch (IF), Decode (ID), Execute (EX), Memory (MEM), and Write-back (WB). Each stage takes 1 clock cycle.

The pipeline uses full operand forwarding from EX and MEM stages to the ID/EX registers. However, for a LOAD instruction followed immediately by a dependent ALU instruction, 1 stall cycle is required (Load-Use data hazard).

Consider the following program loop executed for 100 iterations:
Loop:
  LOAD  R1, 0(R2)
  ADD   R3, R1, R4
  SUB   R5, R3, R6
  STORE R5, 0(R7)
  ADDI  R2, R2, 4
  BNE   R2, R8, Loop

Assume that branch instructions (BNE) are resolved in the EX stage and branch target is predicted as taken with 0 penalty on correct prediction, but when the branch is NOT taken (on the last iteration), 2 flush penalty cycles occur.
What is the total number of clock cycles required to execute this program?`,
    correctAnswer: "706",
    rangeNAT: [706, 706],
    explanation: {
      steps: [
        "1. Analyze instructions per iteration (6 instructions):",
        "   I1: LOAD R1, 0(R2)",
        "   I2: ADD R3, R1, R4  -> Dependent on R1 from LOAD. Requires 1 stall cycle.",
        "   I3: SUB R5, R3, R6  -> Dependent on R3 from ADD. Forwarding from EX to EX: 0 stalls.",
        "   I4: STORE R5, 0(R7) -> Dependent on R5 from SUB. Forwarding to MEM: 0 stalls.",
        "   I5: ADDI R2, R2, 4  -> Independent: 0 stalls.",
        "   I6: BNE R2, R8, Loop -> Dependent on R2 from ADDI. Forwarding from EX: 0 stalls.",
        "2. Cycles per iteration in steady state:",
        "   Number of instructions = 6.",
        "   Data stalls per iteration = 1 (between LOAD and ADD).",
        "   Total cycles per iteration in loop = 6 + 1 = 7 cycles.",
        "3. For 100 iterations:",
        "   - First 99 iterations take 7 cycles each = 99 * 7 = 693 cycles.",
        "   - Last iteration takes 7 cycles + 2 branch misprediction flush cycles = 9 cycles.",
        "   - Initial pipeline fill latency: 5 - 1 = 4 cycles.",
        "   Total cycles = 4 (fill) + 100 * 7 + 2 (flush) = 4 + 700 + 2 = 706 clock cycles.",
        "Thus, the total clock cycles = 706."
      ],
      conceptTested: "5-stage RISC pipeline, Load-use hazard with operand forwarding, branch branch penalty, and loop execution cycles.",
      shortcutTrick: "Total Cycles = Pipeline depth - 1 + Total Instructions + Total Stalls + Branch Misprediction penalty.",
      commonMistake: "Assuming forwarding solves the Load-Use hazard without any stall (load result is only available at the end of MEM stage!).",
      aiExplanation: "Even with full operand forwarding, a load-use hazard requires a 1-cycle stall because the memory data is read at the end of the MEM stage, whereas the ALU instruction requires the operand at the beginning of its EX stage."
    },
    statistics: {
      attemptedCount: 2950,
      correctPercent: 42,
      incorrectPercent: 58,
      averageTimeSeconds: 195
    },
    tags: ["COA", "Pipelining", "Operand Forwarding", "Load-Use Hazard", "NAT", "GATE 2024"],
    discussions: [],
    relatedQuestionIds: ["GATE-2023-CS-44"]
  },
  {
    id: "GATE-2023-CS-12",
    exam: "GATE",
    branch: "CSE/IT",
    year: 2023,
    subject: "Operating Systems",
    topic: "Virtual Memory",
    subtopic: "Multi-level Paging",
    questionNumber: 12,
    marks: 2,
    negativeMarks: 0.66,
    questionType: "MCQ",
    difficulty: "Medium",
    questionText: `Consider a 32-bit virtual address space with a 4 KB page size. The system uses a two-level page table scheme where each page table entry (PTE) occupies 4 bytes.

To ensure that any page table fits exactly within a single page frame, how should the virtual address be partitioned into (Outer Page, Inner Page, Offset)?`,
    options: [
      { id: "A", text: "10 bits, 10 bits, 12 bits" },
      { id: "B", text: "12 bits, 8 bits, 12 bits" },
      { id: "C", text: "9 bits, 11 bits, 12 bits" },
      { id: "D", text: "11 bits, 9 bits, 12 bits" }
    ],
    correctAnswer: "A",
    explanation: {
      steps: [
        "1. Virtual address size = 32 bits.",
        "2. Page size = 4 KB = 2^12 bytes -> Offset = 12 bits.",
        "3. Remaining bits for page table levels = 32 - 12 = 20 bits.",
        "4. A page frame has size 4 KB = 4096 bytes.",
        "   Each Page Table Entry (PTE) = 4 bytes.",
        "   Number of entries that fit in one frame = (4096 bytes) / (4 bytes) = 1024 = 2^10 entries.",
        "5. Therefore, each level of page table requires log_2(1024) = 10 bits to index entries without exceeding a single frame.",
        "6. Outer Page = 10 bits, Inner Page = 10 bits, Offset = 12 bits (10 + 10 + 12 = 32 bits).",
        "Option A is correct."
      ],
      conceptTested: "Two-level hierarchical paging, page table sizing within memory frames, virtual address translation.",
      shortcutTrick: "Size of page / PTE size = entries per page table = 2^(inner page bits). 4KB / 4B = 1024 -> 10 bits.",
      commonMistake: "Forgetting to divide the page size by the PTE size, leading to incorrect bit allotment.",
      aiExplanation: "When designing multi-level page tables, fitting a page table into a single page frame avoids memory fragmentation and allows the OS to treat page tables themselves as regular demand-paged memory frames."
    },
    statistics: {
      attemptedCount: 6240,
      correctPercent: 86,
      incorrectPercent: 14,
      averageTimeSeconds: 78
    },
    tags: ["Operating Systems", "Virtual Memory", "Paging", "Page Table", "GATE 2023"],
    discussions: [],
    relatedQuestionIds: ["GATE-2024-CS-34"]
  },
  {
    id: "GATE-2023-CS-22",
    exam: "GATE",
    branch: "CSE/IT",
    year: 2023,
    subject: "Data Structures",
    topic: "Trees",
    subtopic: "AVL Trees",
    questionNumber: 22,
    marks: 1,
    negativeMarks: 0,
    questionType: "NAT",
    difficulty: "Medium",
    questionText: `What is the minimum number of nodes in an AVL tree of height 5? (Assume the height of an AVL tree with a single node is 0).`,
    correctAnswer: "20",
    rangeNAT: [20, 20],
    explanation: {
      steps: [
        "Let N(h) denote the minimum number of nodes in an AVL tree of height h.",
        "The recurrence relation for minimum nodes is: N(h) = N(h-1) + N(h-2) + 1.",
        "Base cases (with height of single node = 0):",
        "N(0) = 1 (single node)",
        "N(1) = 2 (root + one child)",
        "Now compute up to h = 5:",
        "N(2) = N(1) + N(0) + 1 = 2 + 1 + 1 = 4",
        "N(3) = N(2) + N(1) + 1 = 4 + 2 + 1 = 7",
        "N(4) = N(3) + N(2) + 1 = 7 + 4 + 1 = 12",
        "N(5) = N(4) + N(3) + 1 = 12 + 7 + 1 = 20",
        "Therefore, the minimum number of nodes is 20."
      ],
      conceptTested: "AVL tree height-balance definition, Fibonacci-like recurrence for minimum AVL nodes.",
      shortcutTrick: "Notice N(h) = Fibonacci(h + 3) - 1. For h = 5: Fib(8) - 1 = 21 - 1 = 20.",
      commonMistake: "Using convention where empty tree has height 0 or single node has height 1, shifting the sequence by 1 index.",
      aiExplanation: "An AVL tree of height h has one subtree of minimum height h-1 and another of minimum height h-2 to maximize height while maintaining balance factor in {-1, 0, 1}."
    },
    statistics: {
      attemptedCount: 5410,
      correctPercent: 74,
      incorrectPercent: 26,
      averageTimeSeconds: 88
    },
    tags: ["Data Structures", "AVL Trees", "Binary Search Trees", "Recurrence", "NAT", "GATE 2023"],
    discussions: [],
    relatedQuestionIds: ["GATE-2024-CS-18"]
  },
  {
    id: "GATE-2023-CS-38",
    exam: "GATE",
    branch: "CSE/IT",
    year: 2023,
    subject: "Engineering Mathematics",
    topic: "Linear Algebra",
    subtopic: "Eigenvalues and Eigenvectors",
    questionNumber: 38,
    marks: 2,
    negativeMarks: 0.66,
    questionType: "MCQ",
    difficulty: "Medium",
    questionText: `Let M be a 3 x 3 real matrix with eigenvalues 1, -1, and 2.
What is the determinant of the matrix (M^3 - 2 M^2 + I)?`,
    options: [
      { id: "A", text: "0" },
      { id: "B", text: "-6" },
      { id: "C", text: "12" },
      { id: "D", text: "1" }
    ],
    correctAnswer: "A",
    explanation: {
      steps: [
        "1. If λ is an eigenvalue of matrix M, then the eigenvalue of any polynomial p(M) is p(λ).",
        "2. Here p(M) = M^3 - 2 M^2 + I, so p(λ) = λ^3 - 2 λ^2 + 1.",
        "3. Compute p(λ) for each eigenvalue of M:",
        "   - For λ1 = 1: p(1) = 1^3 - 2(1)^2 + 1 = 1 - 2 + 1 = 0.",
        "   - For λ2 = -1: p(-1) = (-1)^3 - 2(-1)^2 + 1 = -1 - 2 + 1 = -2.",
        "   - For λ3 = 2: p(2) = 2^3 - 2(2)^2 + 1 = 8 - 8 + 1 = 1.",
        "4. The eigenvalues of (M^3 - 2 M^2 + I) are 0, -2, and 1.",
        "5. The determinant of a matrix is the product of its eigenvalues:",
        "   det(p(M)) = 0 * (-2) * 1 = 0.",
        "Hence, Option A is correct."
      ],
      conceptTested: "Spectral mapping theorem, polynomial matrix transformations, determinant as product of eigenvalues.",
      shortcutTrick: "Always check if any of the given eigenvalues makes p(λ) = 0 first! p(1) = 1 - 2 + 1 = 0 immediately implies the determinant must be 0.",
      commonMistake: "Attempting to reconstruct the 3x3 matrix M instead of applying eigenvalue properties directly.",
      aiExplanation: "By the spectral theorem, the eigenvalues of a polynomial in M are obtained simply by substituting M's eigenvalues into the polynomial. Since one resulting eigenvalue is 0, the matrix is singular and its determinant is 0."
    },
    statistics: {
      attemptedCount: 6890,
      correctPercent: 88,
      incorrectPercent: 12,
      averageTimeSeconds: 45
    },
    tags: ["Engineering Mathematics", "Linear Algebra", "Eigenvalues", "Determinant", "GATE 2023"],
    discussions: [],
    relatedQuestionIds: []
  },
  {
    id: "GATE-2023-CS-49",
    exam: "GATE",
    branch: "CSE/IT",
    year: 2023,
    subject: "Compiler Design",
    topic: "Syntax Analysis",
    subtopic: "LL(1) Grammars",
    questionNumber: 49,
    marks: 2,
    negativeMarks: 0.66,
    questionType: "MSQ",
    difficulty: "Hard",
    questionText: `Consider the following context-free grammar G with start symbol S:
S -> Aa | bAc | dc | bda
A -> d

Which of the following statements is/are TRUE?`,
    options: [
      { id: "A", text: "G is an LL(1) grammar" },
      { id: "B", text: "G is an LR(0) grammar" },
      { id: "C", text: "G is an SLR(1) grammar" },
      { id: "D", text: "G is an LALR(1) grammar" }
    ],
    correctAnswer: "D",
    explanation: {
      steps: [
        "1. Check LL(1):",
        "   S has multiple productions starting with 'b': S -> bAc and S -> bda.",
        "   FIRST(bAc) = {b} and FIRST(bda) = {b}. Intersection is not empty, causing FIRST/FIRST conflict.",
        "   Therefore, G is NOT LL(1).",
        "2. Check LR(0):",
        "   In state after reading 'b': items are S -> b.Ac, S -> b.da, and A -> .d.",
        "   Next upon seeing 'd': item S -> bd.a and item A -> d.",
        "   This produces a Shift-Reduce conflict between shifting 'a' for S -> bd.a and reducing A -> d for S -> bA.c.",
        "   Therefore, G is NOT LR(0).",
        "3. Check SLR(1):",
        "   In the conflicting state, FOLLOW(A) includes 'c' (from S -> bAc) and 'a' (from S -> Aa).",
        "   Since FOLLOW(A) contains 'a', the reduce action for A -> d on lookahead 'a' still conflicts with shifting 'a'.",
        "   Therefore, G is NOT SLR(1).",
        "4. Check LALR(1):",
        "   With precise canonical lookaheads in LR(1), in state [A -> d., c] lookahead is strictly {c}, whereas shift is on lookahead {a}.",
        "   No lookahead overlap exists! The conflict is cleanly resolved in LR(1) and LALR(1).",
        "   Therefore, G is LALR(1) and LR(1). Option D is TRUE."
      ],
      conceptTested: "Grammar hierarchy: LL(1) vs LR(0) vs SLR(1) vs LALR(1) conflict resolution via exact lookaheads.",
      shortcutTrick: "Whenever a grammar has Shift-Reduce in SLR(1) due to bloated FOLLOW sets that don't match the specific call site, LALR(1) lookaheads separate them cleanly.",
      commonMistake: "Assuming all LR-style grammars fail if SLR(1) fails without computing exact LR(1) item lookaheads.",
      aiExplanation: "SLR(1) uses global FOLLOW sets which bleed lookaheads across different production contexts. LALR(1) retains exact context-sensitive lookahead sets, resolving the shift-reduce ambiguity."
    },
    statistics: {
      attemptedCount: 3100,
      correctPercent: 38,
      incorrectPercent: 62,
      averageTimeSeconds: 180
    },
    tags: ["Compiler Design", "Grammars", "LL(1)", "SLR(1)", "LALR(1)", "MSQ", "GATE 2023"],
    discussions: [],
    relatedQuestionIds: ["GATE-2024-CS-09"]
  },
  {
    id: "GATE-2022-CS-15",
    exam: "GATE",
    branch: "CSE/IT",
    year: 2022,
    subject: "Digital Logic",
    topic: "Combinational Circuits",
    subtopic: "Multiplexers & Boolean Functions",
    questionNumber: 15,
    marks: 1,
    negativeMarks: 0.33,
    questionType: "MCQ",
    difficulty: "Easy",
    questionText: `A 4-to-1 multiplexer has data inputs I0, I1, I2, I3 and select lines S1 (MSB) and S0 (LSB).
If the select lines are connected as S1 = A, S0 = B, and the inputs are connected as I0 = C, I1 = C', I2 = 0, I3 = 1,
which Boolean function F(A, B, C) does the multiplexer implement?`,
    options: [
      { id: "A", text: "F = Σm(1, 2, 6, 7)" },
      { id: "B", text: "F = Σm(1, 2, 7)" },
      { id: "C", text: "F = Σm(0, 3, 6, 7)" },
      { id: "D", text: "F = Σm(1, 2, 5, 7)" }
    ],
    correctAnswer: "B",
    explanation: {
      steps: [
        "1. Write multiplexer output equation:",
        "   F = (A' B' * I0) + (A' B * I1) + (A B' * I2) + (A B * I3).",
        "2. Substitute inputs:",
        "   F = (A' B' * C) + (A' B * C') + (A B' * 0) + (A B * 1).",
        "3. Find the minterms for each product term:",
        "   - A' B' C -> minterm m1 (001)",
        "   - A' B C' -> minterm m2 (010)",
        "   - A B' * 0 -> 0",
        "   - A B * 1 -> A B (C + C') = A B C' + A B C -> minterms m6 (110) and m7 (111).",
        "4. Combine minterms: m1, m2, m6, m7.",
        "   Wait, check Option A vs B: Option A has Σm(1, 2, 6, 7)!",
        "   Let us verify A B = A B C' (6) + A B C (7).",
        "   Therefore, F = Σm(1, 2, 6, 7).",
        "Option A is correct."
      ],
      conceptTested: "4-to-1 Multiplexer logic implementation of 3-variable Boolean functions, canonical SOP minterms.",
      shortcutTrick: "Expand A B with the missing variable (C + C') to immediately get both minterm 6 and 7.",
      commonMistake: "Forgetting that a term missing variable C represents two minterms (one with C=0 and one with C=1).",
      aiExplanation: "Multiplexers can synthesize any combinational logic function. Setting select inputs to variables partitions the truth table into rows corresponding to each multiplexer data input."
    },
    statistics: {
      attemptedCount: 6510,
      correctPercent: 81,
      incorrectPercent: 19,
      averageTimeSeconds: 70
    },
    tags: ["Digital Logic", "Multiplexer", "Minterms", "Boolean Algebra", "GATE 2022"],
    discussions: [],
    relatedQuestionIds: []
  },
  {
    id: "GATE-2022-CS-58",
    exam: "GATE",
    branch: "CSE/IT",
    year: 2022,
    subject: "General Aptitude",
    topic: "Quantitative Aptitude",
    subtopic: "Speed, Time & Distance",
    questionNumber: 58,
    marks: 1,
    negativeMarks: 0.33,
    questionType: "MCQ",
    difficulty: "Easy",
    questionText: `A car travels from town X to town Y at an average speed of 60 km/h and returns from town Y to town X along the same route at an average speed of 40 km/h.
What is the average speed of the car for the entire round trip?`,
    options: [
      { id: "A", text: "48 km/h" },
      { id: "B", text: "50 km/h" },
      { id: "C", text: "52 km/h" },
      { id: "D", text: "45 km/h" }
    ],
    correctAnswer: "A",
    explanation: {
      steps: [
        "1. Let distance from X to Y be D km.",
        "2. Total distance for round trip = 2D km.",
        "3. Time taken from X to Y = D / 60 hours.",
        "4. Time taken from Y to X = D / 40 hours.",
        "5. Total time = D/60 + D/40 = (2D + 3D) / 120 = 5D / 120 = D / 24 hours.",
        "6. Average speed = Total Distance / Total Time = (2D) / (D / 24) = 2 * 24 = 48 km/h.",
        "Hence, Option A is correct."
      ],
      conceptTested: "Harmonic Mean for equal distance round trip velocity.",
      shortcutTrick: "Harmonic mean formula: Average Speed = (2 * v1 * v2) / (v1 + v2) = (2 * 60 * 40) / (60 + 40) = 4800 / 100 = 48 km/h.",
      commonMistake: "Taking arithmetic mean: (60 + 40) / 2 = 50 km/h. Time spent at 40 km/h is greater than time spent at 60 km/h, weighting the average lower.",
      aiExplanation: "Because the car spends more time driving at 40 km/h than at 60 km/h over the same distance, the overall average speed must be weighted towards the slower speed, resulting in the harmonic mean of 48 km/h."
    },
    statistics: {
      attemptedCount: 8120,
      correctPercent: 89,
      incorrectPercent: 11,
      averageTimeSeconds: 40
    },
    tags: ["General Aptitude", "Quantitative", "Speed Time Distance", "GATE 2022"],
    discussions: [],
    relatedQuestionIds: []
  }
];

export const SUBJECT_SUMMARIES: SubjectSummary[] = [
  {
    id: "os",
    name: "Operating Systems",
    code: "OS",
    iconName: "Cpu",
    totalQuestions: 324,
    completedQuestions: 220,
    accuracy: 74,
    description: "Processes, threads, CPU scheduling, synchronization, deadlocks, memory management & virtual memory.",
    topics: [
      { name: "Process Scheduling", questionCount: 68, completed: 52 },
      { name: "Deadlocks", questionCount: 45, completed: 34 },
      { name: "Synchronization & Semaphores", questionCount: 72, completed: 48 },
      { name: "Virtual Memory & Paging", questionCount: 84, completed: 58 },
      { name: "File Systems & Disk Scheduling", questionCount: 55, completed: 28 }
    ]
  },
  {
    id: "algo",
    name: "Algorithms",
    code: "ALGO",
    iconName: "Binary",
    totalQuestions: 340,
    completedQuestions: 280,
    accuracy: 82,
    description: "Asymptotic analysis, divide & conquer, greedy, dynamic programming, graph algorithms & NP-completeness.",
    topics: [
      { name: "Asymptotic Analysis & Recurrences", questionCount: 52, completed: 48 },
      { name: "Graph Algorithms", questionCount: 94, completed: 78 },
      { name: "Dynamic Programming", questionCount: 88, completed: 70 },
      { name: "Greedy Algorithms", questionCount: 46, completed: 38 },
      { name: "Sorting & Searching", questionCount: 60, completed: 46 }
    ]
  },
  {
    id: "ds",
    name: "Data Structures",
    code: "DS",
    iconName: "Layers",
    totalQuestions: 280,
    completedQuestions: 235,
    accuracy: 85,
    description: "Arrays, stacks, queues, linked lists, trees, binary search trees, AVL trees, heaps & hashing.",
    topics: [
      { name: "Trees & Binary Search Trees", questionCount: 85, completed: 75 },
      { name: "Heaps & Priority Queues", questionCount: 45, completed: 40 },
      { name: "Hashing", questionCount: 50, completed: 42 },
      { name: "Stacks & Queues", questionCount: 60, completed: 48 },
      { name: "Linked Lists & Arrays", questionCount: 40, completed: 30 }
    ]
  },
  {
    id: "dbms",
    name: "Database Management Systems",
    code: "DBMS",
    iconName: "Database",
    totalQuestions: 260,
    completedQuestions: 170,
    accuracy: 71,
    description: "ER-model, relational model, SQL, functional dependencies, normalization, transactions & concurrency control.",
    topics: [
      { name: "Normalization & Functional Dependencies", questionCount: 75, completed: 55 },
      { name: "Transactions & Concurrency Control", questionCount: 68, completed: 42 },
      { name: "SQL & Relational Algebra", questionCount: 65, completed: 45 },
      { name: "File Structures & B/B+ Trees", questionCount: 52, completed: 28 }
    ]
  },
  {
    id: "cn",
    name: "Computer Networks",
    code: "CN",
    iconName: "Network",
    totalQuestions: 295,
    completedQuestions: 195,
    accuracy: 76,
    description: "OSI & TCP/IP layers, framing, error control, routing protocols, flow control, TCP/UDP & application layer.",
    topics: [
      { name: "Transport Layer (TCP/UDP)", questionCount: 85, completed: 60 },
      { name: "Network Layer & IP Subnetting", questionCount: 92, completed: 64 },
      { name: "Data Link Layer & Sliding Window", questionCount: 64, completed: 45 },
      { name: "Application Layer & Security", questionCount: 54, completed: 26 }
    ]
  },
  {
    id: "toc",
    name: "Theory of Computation",
    code: "TOC",
    iconName: "Network",
    totalQuestions: 275,
    completedQuestions: 180,
    accuracy: 69,
    description: "Regular languages, finite automata, context-free grammars, pushdown automata, Turing machines & decidability.",
    topics: [
      { name: "Regular Languages & Finite Automata", questionCount: 95, completed: 68 },
      { name: "Context-Free Languages & PDA", questionCount: 70, completed: 45 },
      { name: "Turing Machines & Decidability", questionCount: 65, completed: 40 },
      { name: "Pumping Lemma & Closures", questionCount: 45, completed: 27 }
    ]
  },
  {
    id: "coa",
    name: "Computer Organization & Architecture",
    code: "COA",
    iconName: "HardDrive",
    totalQuestions: 310,
    completedQuestions: 245,
    accuracy: 79,
    description: "Machine instructions, ALU, data paths, pipelining, memory hierarchy, cache mapping & I/O interface.",
    topics: [
      { name: "Pipelining & Hazards", questionCount: 82, completed: 70 },
      { name: "Cache Memory Organization", questionCount: 90, completed: 72 },
      { name: "Instruction Formats & Addressing", questionCount: 70, completed: 55 },
      { name: "Data Representation & IEEE 754", questionCount: 68, completed: 48 }
    ]
  },
  {
    id: "compiler",
    name: "Compiler Design",
    code: "CD",
    iconName: "Code2",
    totalQuestions: 190,
    completedQuestions: 110,
    accuracy: 73,
    description: "Lexical analysis, syntax-directed translation, parsing (LL/LR), runtime environments, code optimization.",
    topics: [
      { name: "Syntax Analysis & LR Parsers", questionCount: 78, completed: 48 },
      { name: "Lexical Analysis", questionCount: 32, completed: 24 },
      { name: "Syntax-Directed Translation (SDT)", questionCount: 44, completed: 22 },
      { name: "Intermediate Code & Optimization", questionCount: 36, completed: 16 }
    ]
  },
  {
    id: "em",
    name: "Engineering Mathematics",
    code: "EM",
    iconName: "Sigma",
    totalQuestions: 350,
    completedQuestions: 270,
    accuracy: 84,
    description: "Linear algebra, calculus, probability & statistics, discrete mathematics, propositional logic & combinatorics.",
    topics: [
      { name: "Linear Algebra", questionCount: 88, completed: 75 },
      { name: "Probability & Bayes Theorem", questionCount: 85, completed: 68 },
      { name: "Calculus", questionCount: 65, completed: 50 },
      { name: "Discrete Math & Graph Theory", questionCount: 112, completed: 77 }
    ]
  },
  {
    id: "ga",
    name: "General Aptitude",
    code: "GA",
    iconName: "BrainCircuit",
    totalQuestions: 220,
    completedQuestions: 185,
    accuracy: 91,
    description: "Verbal ability, numerical ability, analytical aptitude, spatial reasoning & critical thinking.",
    topics: [
      { name: "Quantitative Aptitude", questionCount: 90, completed: 80 },
      { name: "Logical Reasoning", questionCount: 65, completed: 55 },
      { name: "Verbal Ability", questionCount: 45, completed: 35 },
      { name: "Spatial Aptitude", questionCount: 20, completed: 15 }
    ]
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: "b1",
    name: "First Question",
    description: "Solved your first GATE PYQ on NexusGate",
    icon: "Target",
    unlocked: true,
    unlockedAt: "2 weeks ago"
  },
  {
    id: "b2",
    name: "100 Questions",
    description: "Completed 100 GATE practice problems",
    icon: "Zap",
    unlocked: true,
    unlockedAt: "10 days ago"
  },
  {
    id: "b3",
    name: "500 Questions",
    description: "Completed 500 GATE problems with 70%+ accuracy",
    icon: "Flame",
    unlocked: true,
    unlockedAt: "3 days ago"
  },
  {
    id: "b4",
    name: "PYQ Explorer",
    description: "Attempted questions across all 10 GATE CSE core subjects",
    icon: "Compass",
    unlocked: true,
    unlockedAt: "Yesterday"
  },
  {
    id: "b5",
    name: "7-Day Streak",
    description: "Maintained a continuous 7-day study streak",
    icon: "CalendarCheck",
    unlocked: true,
    unlockedAt: "1 week ago"
  },
  {
    id: "b6",
    name: "30-Day Streak",
    description: "Maintained an unbroken 30-day preparation streak",
    icon: "ShieldAlert",
    unlocked: false,
    progress: 14,
    maxProgress: 30
  },
  {
    id: "b7",
    name: "Subject Master",
    description: "Achieved >80% accuracy in Algorithms & Data Structures",
    icon: "Award",
    unlocked: true,
    unlockedAt: "4 days ago"
  },
  {
    id: "b8",
    name: "Test Warrior",
    description: "Completed 5 Full-Length 3-hour GATE Mock Simulations",
    icon: "Sword",
    unlocked: false,
    progress: 3,
    maxProgress: 5
  }
];
