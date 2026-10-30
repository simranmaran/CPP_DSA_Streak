const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY='zero-to-cpp-planner-v1';
const def=()=>({done:{},rev:{},notes:{},custom:[],habits:{},studyMin:0,squad:[],settings:{focus:25,brk:5,target:'2026-11-01T23:59'},hideWelcome:false,view:'dashboard',best:0,free:'',filter:'all',sort:'plan'});
function load(){try{const r=JSON.parse(localStorage.getItem(KEY));if(r&&typeof r==='object'){const d=def();Object.assign(d,r);d.settings=Object.assign(def().settings,r.settings||{});return d}}catch(e){}return def()}
let S=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}

/* ---------- icons ---------- */
const P={dash:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',cal:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
list:'<path d="M9 6h12M9 12h12M9 18h12M3 6h.01M3 12h.01M3 18h.01"/>',rev:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
note:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5c2.2.6 3.5 2.4 3.5 5.5"/>',
gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
cap:'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>',check:'<path d="M5 12.5l4.5 4.5L19 7"/>',
play:'<path d="M7 4l13 8-13 8z"/>',pause:'<path d="M8 5v14M16 5v14"/>',reset:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',book:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/>',
mark:'<path d="M6 3h12v18l-6-4-6 4z"/>',plus:'<path d="M12 5v14M5 12h14"/>',trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
x:'<path d="M6 6l12 12M18 6L6 18"/>',copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/>',
pen:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',minus:'<path d="M5 12h14"/>'};
const ic=n=>`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${P[n]||''}</svg>`;

/* ---------- plan data ---------- */
const PRI={m:'Must Complete',r:'Recommended',o:'Optional if Time Permits'};
const PRC={m:'var(--red)',r:'var(--amber)',o:'var(--green)'};
const SRC={c:'Course topic',g:'Study guide',x:'Additional practice'};
const SRCC={c:'var(--purple)',g:'var(--blue)',x:'var(--amber)'};
const DAYS=[
 {k:'fri',name:'Friday',date:'2026-10-30',label:'Oct 30',month:'October 30',n:1,title:'Programming Logic + C++ Fundamentals',goal:'Understand what programming is, learn basic problem-solving, and start writing simple C++ programs.',icon:'flag'},
 {k:'sat',name:'Saturday',date:'2026-10-31',label:'Oct 31',month:'October 31',n:2,title:'Loops, Functions, Arrays + Strings',goal:'Repeat work with loops, split code into functions, and store data in arrays and strings. End with recursion and Big-O.',icon:'cal'},
 {k:'sun',name:'Sunday',date:'2026-11-01',label:'Nov 1',month:'November 1',n:3,title:'Pointers, STL + Searching and Sorting',goal:'Meet pointers and vectors, then solve classic searching, sorting and two-pointer problems. Finish with a revision sprint.',icon:'sun'}];
const PLAN=[
 {day:'fri',cat:'Programming Basics',title:'Programming, Flowcharts and Problem-Solving Basics',items:[
  ['Breaking The Myth','Why coding is learnable and how this 3-day plan works.','m','c',15],
  ['Programming and What Are Computers?','What a program is and how a computer follows instructions.','m','c',25],
  ['How to Think Like a Programmer','Break a problem into inputs, steps and outputs.','m','c',30],
  ['Flowcharts and Pseudocode','Learn Start/End, Input/Output, Process and Decision symbols. Write pseudocode for adding two numbers.','m','c',35],
  ['Flowchart Problem-Solving','Create flowcharts for checking even/odd and for finding the larger of two numbers.','r','c',35],
  ['Dry Runs, Edge Cases and Debugging','Understand dry runs, trace variables, and test normal inputs and boundary cases.','r','c',30],
  ['Programming Languages and Choosing a Path','Understand compiled languages at a beginner level and why we use C++ for DSA.','o','c',15]]},
 {day:'fri',cat:'C++ Basics',title:'C++ Fundamentals, Input/Output and Control Flow — Intro',items:[
  ['Introduction to C++','Basic structure of a C++ program: main(), #include <iostream>, cout, return 0.','m','g',30],
  ['Input and Output','Learn cout and cin. Read two integers and print their sum.','m','g',30],
  ['Data Types and Variables','Learn int, long long, char, float, double and bool. Declaration vs initialization.','m','g',35],
  ['Operators and Expressions','Arithmetic, relational and logical operators, plus integer division.','m','g',30],
  ['Conditionals: if / else','Make decisions with if, else if, else and the ternary operator.','r','g',35],
  ['Loops: for and while','Repeat work with for and while loops and trace them by hand.','r','g',30]]},
 {day:'fri',cat:'Coding Practice',title:'Friday Coding Practice',items:[
  ['Print Your Name and Age','Print two lines: your name, then your age.','m','x',10],
  ['Sum of Two Numbers','Read two integers and print their sum. Input: 4 7. Output: 11.','m','x',10],
  ['Even or Odd','Read n and print Even or Odd. Input: 9. Output: Odd.','m','x',10],
  ['Largest of Three Numbers','Read three integers and print the largest.','r','x',10],
  ['Sum of 1 to N','Read N and print 1 + 2 + … + N. Input: 5. Output: 15.','r','x',15],
  ['Multiplication Table','Read n and print its table from 1 to 10.','o','x',10]]},
 {day:'fri',cat:'Quiz',title:'Friday Mini-Quiz',items:[['Friday Mini-Quiz','Five quick questions on today’s topics. Open Revision & Quiz to take it.','m','x',10]]},

 {day:'sat',cat:'Control Flow & Functions',title:'Loops, Patterns and Functions',items:[
  ['Nested Loops','Run a loop inside a loop and count how often the inner body runs.','m','g',30],
  ['Pattern Printing','Print stars, number triangles and pyramids with nested loops.','m','g',35],
  ['break and continue','Exit a loop early or skip a single round.','r','g',20],
  ['Functions Basics','Write, call and reuse a function. Declaration vs definition.','m','g',35],
  ['Parameters and Return Values','Pass data in and get a result out. void vs non-void.','m','g',30],
  ['Scope and Pass by Reference','Local vs global variables, and when & avoids copying.','r','g',30]]},
 {day:'sat',cat:'Arrays & Strings',title:'Arrays and Strings',items:[
  ['Arrays Basics','Declare, fill and read arrays. Indexes start at 0.','m','g',35],
  ['Traversal, Max and Min','Walk an array once to find its largest and smallest value.','m','g',30],
  ['Prefix Sums','Answer range-sum questions in one subtraction.','r','g',30],
  ['2D Arrays','Store a table of values and visit it with nested loops.','o','g',30],
  ['Strings in C++','Use string, size(), indexing and joining.','m','g',30],
  ['String Problems: Reverse and Palindrome','Use two indices that walk toward each other.','r','g',30]]},
 {day:'sat',cat:'Recursion & Complexity',title:'Recursion and Complexity Intro',items:[
  ['Recursion Intro','A function that calls itself, with a base case that stops it.','m','c',35],
  ['Factorial and Fibonacci','Two classic recursive functions and how they unfold.','m','c',30],
  ['Tracing the Call Stack','Draw the stack to see the order of calls and returns.','r','c',25],
  ['Time Complexity and Big-O','How running time grows with input size: O(1), O(n), O(n²), O(log n).','m','c',35],
  ['Space Complexity','How much extra memory a solution needs.','o','c',20]]},
 {day:'sat',cat:'Coding Practice',title:'Saturday Coding Practice',items:[
  ['Print a Right Triangle','Read n and print a triangle of stars with n rows.','m','x',10],
  ['Count Digits of a Number','Read n and print how many digits it has. Input: 4096. Output: 4.','m','x',10],
  ['Reverse an Array','Read n numbers and print them in reverse order.','m','x',15],
  ['Check Palindrome String','Read a word and print Yes if it reads the same backwards.','r','x',10],
  ['Factorial Using Recursion','Write fact(n) recursively. Input: 5. Output: 120.','r','x',10],
  ['Find Second Largest','Find the second largest value in an array without sorting.','o','x',15]]},
 {day:'sat',cat:'Quiz',title:'Saturday Mini-Quiz',items:[['Saturday Mini-Quiz','Five quick questions on loops, functions and arrays. Open Revision & Quiz to take it.','m','x',10]]},

 {day:'sun',cat:'Pointers & STL',title:'Pointers, Vectors and STL',items:[
  ['Memory and Addresses','Every variable lives at an address. Use & to see it.','m','g',25],
  ['Pointers Basics','Store an address in a pointer and read or change the value through it.','m','g',35],
  ['References vs Pointers','Two ways to reach the same variable, and when to use which.','r','g',25],
  ['Dynamic Memory Overview','A first look at new and delete. Awareness only.','o','g',20],
  ['Vectors','Resizable arrays: push_back, size, loops.','m','g',35],
  ['sort, pair and Maps','Sort with one line and count things with a map.','r','g',30]]},
 {day:'sun',cat:'Searching & Sorting',title:'Searching, Sorting and Patterns',items:[
  ['Linear Search','Check each item until you find the key.','m','c',25],
  ['Binary Search','Halve the search range each step on a sorted array.','m','c',35],
  ['Bubble and Selection Sort','Two simple sorts and how to dry run them.','r','c',35],
  ['Two Pointers','Walk from both ends of a sorted array.','r','c',30],
  ['Frequency Counting with Maps','Count how often each value appears.','r','c',30],
  ['Binary Search on Answer','Awareness only: binary search on a range of possible answers.','o','c',20]]},
 {day:'sun',cat:'Revision',title:'Revision Sprint',items:[
  ['Revise Marked Topics','Open Revision & Quiz and go through everything you marked.','m','x',40],
  ['Redo Hard Dry Runs','Pick three tricky programs and trace them again on paper.','m','x',30],
  ['Complexity Cheat Sheet','Write one page: O(1), O(log n), O(n), O(n²) with an example each.','r','x',20],
  ['Plan Your Next Week','Choose five topics to study next and when.','o','x',15]]},
 {day:'sun',cat:'Coding Practice',title:'Sunday Coding Practice',items:[
  ['Linear Search in an Array','Read an array and a key. Print the index or -1.','m','x',10],
  ['Binary Search Implementation','Write binary search on a sorted array.','m','x',15],
  ['Sort an Array with sort()','Read n numbers and print them in ascending order.','m','x',10],
  ['Count Frequency of Elements','Print each distinct value with its count.','r','x',15],
  ['Two Sum (Sorted Array)','Find two values that add up to a target using two pointers.','r','x',15],
  ['Reverse a Vector','Reverse a vector in place with two indices.','m','x',10],
  ['Maximum Subarray Sum (Brute Force)','Try every subarray and keep the best sum.','o','x',20]]},
 {day:'sun',cat:'Quiz',title:'Final Mock Quiz',items:[['Sunday Mock Quiz','Five mixed questions from all three days. Open Revision & Quiz to take it.','m','x',15]]}
];
const BASE=[];
PLAN.forEach((b,bi)=>b.items.forEach((it,ii)=>BASE.push({id:`${b.day}-${bi}-${ii}`,day:b.day,bi,cat:b.cat,block:b.title,title:it[0],desc:it[1],pri:it[2],src:it[3],min:it[4]})));
const allTasks=()=>BASE.concat(S.custom.map(c=>Object.assign({cat:'My tasks',block:'My tasks',bi:999,src:'x'},c)));
const byId=id=>allTasks().find(t=>t.id===id);
const dayOf=k=>DAYS.find(d=>d.k===k);

/* ---------- lessons ---------- */
const L={
'Introduction to C++':['Every C++ program has the same skeleton. #include <iostream> brings in input/output tools. using namespace std; lets us write cout instead of std::cout. int main() is where the program starts. return 0; means "finished successfully".',['Every statement ends with a semicolon ;','Code inside { } belongs together (a block).','C++ is case-sensitive: Main is not main.'],'A letter has a fixed format: address, greeting, body, sign-off. A C++ program also has a fixed format around your real code.',`#include <iostream>
using namespace std;

int main() {
    cout << "My first C++ program" << endl;
    return 0;
}`,'My first C++ program','Write a program that prints your name and your city on two separate lines.'],
'Input and Output':['cout prints to the screen with <<. cin reads from the keyboard with >>. Chain them to handle several values at once.',['cout << a << b; prints several values.','cin >> x >> y; reads two values.','endl moves to a new line.'],'cout is a speaker and cin is a microphone. Data flows in the direction of the arrows.',`int a, b;
cin >> a >> b;
cout << "Sum = " << a + b << endl;`,'Input: 4 7  →  Sum = 11','Read two integers and print their sum, difference and product.'],
'Data Types and Variables':['A variable is a named box in memory. Its type decides what it can hold and how much space it takes.',['int for whole numbers; long long when values pass about 2 billion.','double for decimals, char for one character, bool for true/false.','Declare and assign together: int age = 20;'],'Labelled jars: a jar for rice cannot hold water, just as an int cannot hold 3.5.',`int age = 20;
double gpa = 8.7;
char grade = 'A';
bool ready = true;
cout << age << " " << gpa << " " << grade << " " << ready << endl;`,'20 8.7 A 1','Store your age, height and first initial in variables and print them.'],
'Operators and Expressions':['Arithmetic (+ - * / %), relational (< > == !=) and logical (&& || !) operators build every condition. With two ints, / drops the decimal part.',['7 / 2 is 3, but 7 / 2.0 is 3.5.','% gives the remainder: 7 % 3 is 1.','= assigns, == compares.'],'% is the leftover slice after sharing pizza equally: 7 slices among 3 people leaves 1.',`int a = 7, b = 2;
cout << a / b << " " << a % b << " " << (a > b && b > 0) << endl;`,'3 1 1','Check whether a number is divisible by both 3 and 5.'],
'Conditionals: if / else':['if runs a block only when its condition is true. Add else if for more branches and else for the fallback.',['Conditions go inside ( ).','Only the first true branch runs.','Use { } even for one line to avoid bugs.'],'A traffic light: if green go, else if yellow slow down, else stop.',`int n;
cin >> n;
if (n % 2 == 0) cout << "Even" << endl;
else cout << "Odd" << endl;`,'Input: 9  →  Odd','Print the largest of three numbers using if / else if.'],
'Loops: for and while':['A loop repeats a block. for suits a known count; while suits "repeat until something changes".',['for (init; condition; update) { }','Trace i on paper: start, test, run, update.','Forgetting the update gives an infinite loop.'],'Climbing stairs: start at step 1 and keep climbing while you are below the top.',`int sum = 0;
for (int i = 1; i <= 5; i++) {
    sum += i;
}
cout << sum << endl;`,'15','Print the sum of the numbers from 1 to N.'],
'Nested Loops':['An inner loop runs fully for every single round of the outer loop. If the outer loop runs n times and the inner runs m times, the body runs n × m times.',['Outer loop = rows, inner loop = columns.','Trace with a table of i and j.','Cost grows fast: n × n is n².'],'A clock: the minute hand makes 60 steps for each single step of the hour hand.',`for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 2; j++) {
        cout << i << "," << j << " ";
    }
}`,'1,1 1,2 2,1 2,2 3,1 3,2','Print all pairs (i, j) for i and j from 1 to 3.'],
'Pattern Printing':['Pick a row number i and ask how many spaces and stars row i needs. Then write one inner loop for each.',['Row i has i stars in a right triangle.','Print endl after each row.','Draw the pattern on paper with row numbers first.'],'Laying bricks: each new row has one brick more than the row above.',`int n = 4;
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= i; j++) cout << "*";
    cout << endl;
}`,`*
**
***
****`,'Print a pyramid of height 4 using spaces and stars.'],
'break and continue':['break leaves the loop at once. continue skips the rest of this round and moves on to the next.',['break means "found it, stop".','continue means "skip this one".','Both affect only the innermost loop.'],'Searching for keys: break when you find them; continue when a drawer is empty and you move to the next.',`for (int i = 1; i <= 6; i++) {
    if (i == 3) continue;
    if (i == 5) break;
    cout << i << " ";
}`,'1 2 4','Print 1 to 20 but skip multiples of 4 and stop at 15.'],
'Functions Basics':['A function packages code under a name so you can reuse it. Define it once and call it as often as needed.',['Syntax: returnType name(parameters) { }','Define it above main, or declare it first.','main() is itself a function.'],'A recipe card: write it once, cook it whenever you like.',`void greet() {
    cout << "Hello, coder!" << endl;
}
int main() {
    greet();
    greet();
}`,`Hello, coder!
Hello, coder!`,'Write a function that prints a line of 10 dashes and call it three times.'],
'Parameters and Return Values':['Parameters carry data in. return sends one result back. void means nothing is returned.',['Arguments are copied into parameters by default.','return ends the function immediately.','The return type must match what you return.'],'A vending machine: you insert coins (parameters) and receive a snack (return value).',`int square(int x) {
    return x * x;
}
int main() {
    cout << square(6) << endl;
}`,'36','Write max2(a, b) and use it to find the largest of three numbers.'],
'Scope and Pass by Reference':['A variable lives only inside the block where it is declared. Passing with & hands the function the original variable instead of a copy.',['Local variables vanish at the closing brace.','void f(int &x) changes the caller’s variable.','Use const & for large objects you only read.'],'A photocopy vs the original: editing the copy leaves the original untouched.',`void addOne(int &x) { x++; }
int main() {
    int n = 5;
    addOne(n);
    cout << n << endl;
}`,'6','Write swapValues(int &a, int &b) and test it.'],
'Arrays Basics':['An array stores many values of one type in a row. Indexes start at 0, so the last of n items sits at n − 1.',['int a[5] = {4, 8, 15, 16, 23};','a[0] is the first element.','Going past the end is a silent bug.'],'A row of lockers numbered from 0, each holding one item of the same kind.',`int a[5] = {4, 8, 15, 16, 23};
cout << a[0] << " " << a[4] << endl;`,'4 23','Read 5 numbers into an array and print them in reverse.'],
'Traversal, Max and Min':['Visit every element with a loop. To find the maximum, start with the first item and update whenever you meet a bigger one.',['Start max at a[0], not at 0.','One pass is enough: O(n).','The same idea finds min and sum.'],'Looking for the tallest student: remember the tallest so far and compare each new face.',`int mx = a[0];
for (int i = 1; i < n; i++) {
    if (a[i] > mx) mx = a[i];
}
cout << mx << endl;`,'Array 4 8 15 16 23  →  23','Find both the minimum and the maximum in one loop.'],
'Prefix Sums':['A prefix array stores running totals, so the sum of any range is one subtraction instead of a loop.',['pre[i] = pre[i-1] + a[i]','Sum of l..r = pre[r] − pre[l−1]','Build once in O(n), answer each query in O(1).'],'A bank passbook: the balance on one day minus the balance on an earlier day is the money in between.',`pre[0] = a[0];
for (int i = 1; i < n; i++) pre[i] = pre[i-1] + a[i];
cout << pre[3] - pre[1] << endl;`,'For a = 1 2 3 4 5 the output is 7 (a[2] + a[3]).','For 6 numbers, answer the sum of positions 2 to 4 using a prefix array.'],
'2D Arrays':['A 2D array is a table: arr[row][col]. Use two nested loops to visit it.',['int g[3][3];','Outer loop rows, inner loop columns.','Row sums and diagonals are common questions.'],'A chessboard or spreadsheet: a row number and a column number point to one cell.',`int g[2][3] = {{1,2,3},{4,5,6}};
int s = 0;
for (int i = 0; i < 2; i++)
    for (int j = 0; j < 3; j++) s += g[i][j];
cout << s << endl;`,'21','Print the sum of each row of a 3×3 matrix.'],
'Strings in C++':['string holds text. Use s.size() for the length, s[i] for a character and + to join.',['#include <string>','getline(cin, s) reads a whole line.','Characters are indexed from 0 like arrays.'],'A necklace of beads where each bead is one character with its own position.',`string s = "code";
cout << s.size() << " " << s[0] << " " << s + "r" << endl;`,'4 c coder','Read a word and count how many vowels it has.'],
'String Problems: Reverse and Palindrome':['Two indices, one at each end, walk toward the middle. If every pair matches, the word is a palindrome.',['i = 0, j = n − 1, then move inwards.','Stop when i >= j.','reverse(s.begin(), s.end()) also works.'],'Two people reading the same sentence from opposite ends until they meet.',`bool isPal(string s) {
    int i = 0, j = s.size() - 1;
    while (i < j) {
        if (s[i++] != s[j--]) return false;
    }
    return true;
}`,'isPal("madam") → true','Check whether a word is a palindrome and print Yes or No.'],
'Recursion Intro':['A recursive function calls itself on a smaller version of the problem. It needs a base case that stops the calls.',['Base case: when to stop.','Recursive case: shrink the problem.','No base case means endless calls.'],'Russian nesting dolls: open each doll until you reach the smallest one that does not open.',`void countDown(int n) {
    if (n == 0) return;
    cout << n << " ";
    countDown(n - 1);
}`,'countDown(3) prints 3 2 1','Write a recursive function that prints 1 to n.'],
'Factorial and Fibonacci':['n! = n × (n − 1)!, with 0! = 1. Fibonacci adds the previous two numbers, so it calls itself twice.',['fact(5) = 120.','fib(0) = 0 and fib(1) = 1.','Naive Fibonacci repeats work and gets slow.'],'A queue of people each asking the person ahead for an answer, then multiplying on the way back.',`int fact(int n) {
    if (n <= 1) return 1;
    return n * fact(n - 1);
}`,'fact(5) → 120','Print the first 8 Fibonacci numbers using a recursive function.'],
'Time Complexity and Big-O':['Big-O describes how running time grows as the input size n grows, ignoring constants.',['O(1) constant, O(n) one loop, O(n²) nested loops.','O(log n) means halving each step, as in binary search.','Drop constants and smaller terms.'],'Finding a name: scanning a whole phone book is O(n); opening in the middle each time is O(log n).',`for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)
        count++;   // runs n * n times: O(n^2)`,'n = 1000 → about 1,000,000 steps','State the complexity of: one loop to n, two nested loops to n, and a loop that halves n.'],
'Memory and Addresses':['Every variable lives at an address in memory. The & operator gives the address of a variable.',['Addresses print as hexadecimal numbers.','Two variables never share an address.','The address is where the value lives, not the value.'],'Houses on a street: the value is the family inside, the address is the house number.',`int x = 10;
cout << x << " " << &x << endl;`,'10 0x7ffc… (the address varies)','Print the addresses of two variables and compare them.'],
'Pointers Basics':['A pointer stores an address. * in a declaration makes a pointer, and * in front of a pointer reads or changes the value it points to.',['int *p = &x; stores the address of x.','*p = 25; changes x itself.','A pointer with no target should be nullptr.'],'A pointer is a written note saying "the key is in drawer 7". Following the note is dereferencing.',`int x = 10;
int *p = &x;
*p = 25;
cout << x << endl;`,'25','Use a pointer to double the value of a variable.'],
'References vs Pointers':['A reference is another name for the same variable and cannot be null or re-pointed. A pointer can be null and can change its target, but needs * to read.',['int &r = x; r is x.','References are safer for function parameters.','Pointers are needed for arrays and dynamic memory.'],'A nickname (reference) always means the same person; a note (pointer) can be crossed out and rewritten.',`int x = 5;
int &r = x;
r = 9;
cout << x << endl;`,'9','Rewrite swapValues using pointers instead of references.'],
'Vectors':['A vector is a resizable array. It grows with push_back and knows its own size.',['#include <vector>','v.push_back(x), v.size(), v[i]','for (int x : v) loops over every item.'],'An accordion folder that gets bigger when you add papers.',`vector<int> v = {3, 1, 2};
v.push_back(7);
cout << v.size() << " " << v[3] << endl;`,'4 7','Read n numbers into a vector and print their average.'],
'sort, pair and Maps':['sort(v.begin(), v.end()) sorts in one line. A map stores key → value pairs, handy for counting.',['#include <algorithm> for sort.','map<int,int> f; f[x]++; counts x.','pair<int,int> holds two values together.'],'A dictionary: look up a word (key) to get its meaning (value).',`vector<int> v = {5, 2, 9, 1};
sort(v.begin(), v.end());
for (int x : v) cout << x << " ";`,'1 2 5 9','Sort pairs of (marks, roll number) by marks.'],
'Linear Search':['Check each item from left to right until you find the key or reach the end.',['Worst case O(n).','Works on unsorted data.','Return -1 when not found.'],'Looking for a book on a shelf by reading each spine in order.',`for (int i = 0; i < n; i++)
    if (a[i] == key) { cout << i; break; }`,'Array 4 8 15, key 8 → 1','Count how many times the key appears in an array.'],
'Binary Search':['On a sorted array, compare with the middle item and discard half the range each step.',['Array must be sorted.','Use mid = lo + (hi - lo) / 2.','O(log n) steps.'],'Guessing a number between 1 and 100: always ask "higher or lower than 50?"',`int lo = 0, hi = n - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] == key) return mid;
    if (a[mid] < key) lo = mid + 1;
    else hi = mid - 1;
}
return -1;`,'Sorted 2 4 6 8 10, key 8 → index 3','Find the first position of a key in a sorted array with duplicates.'],
'Bubble and Selection Sort':['Bubble sort swaps neighbours that are out of order. Selection sort picks the smallest item and places it first. Both take O(n²).',['Dry run on 4 numbers first.','Bubble: biggest value sinks to the end each pass.','Use sort() in real code.'],'Sorting playing cards in your hand by repeatedly fixing the wrong neighbours.',`for (int i = 0; i < n - 1; i++)
    for (int j = 0; j < n - i - 1; j++)
        if (a[j] > a[j+1]) swap(a[j], a[j+1]);`,'5 2 9 1 → 1 2 5 9','Dry run bubble sort on 4 3 2 1 and count the swaps.'],
'Two Pointers':['Place one pointer at each end of a sorted array and move them inward based on the current sum.',['Sum too small: move the left pointer right.','Sum too big: move the right pointer left.','One pass: O(n).'],'Two people walking toward each other along a corridor until they meet the right spot.',`int i = 0, j = n - 1;
while (i < j) {
    int s = a[i] + a[j];
    if (s == target) break;
    if (s < target) i++; else j--;
}`,'Sorted 1 3 5 8, target 9 → pair (1, 8)','Check whether a sorted array has two numbers with a given difference.'],
'Frequency Counting with Maps':['A map counts how often each value appears in one pass.',['f[x]++ creates the key if missing.','Maps keep keys in sorted order.','O(n log n) overall.'],'A tally chart on paper: add a stroke each time you see a value.',`map<int,int> f;
for (int x : v) f[x]++;
for (auto &p : f) cout << p.first << ":" << p.second << " ";`,'v = 1 2 2 3 → 1:1 2:2 3:1','Find the value that appears most often.']
};
function lessonFor(t){
  if(L[t.title]){const l=L[t.title];return{e:l[0],b:l[1],a:l[2],c:l[3],o:l[4],q:l[5]}}
  if(t.cat==='Coding Practice')return{e:'Try this on your own first before looking for help.',b:['Write the sample input and expected output on paper.','Dry run once with a normal case and once with an edge case.','Type the code, run it, and compare.'],q:t.desc};
  if(t.cat==='Quiz')return{e:t.desc,b:['Take it after the day’s topics.','Wrong answers are the most useful part.','Mark weak topics for revision.'],q:'Open Revision & Quiz and finish one round.',quiz:true};
  return{e:t.desc,b:['Read the topic once, then close the book.','Write one small example by hand.','Explain it in your own words in My Notes.'],a:'',q:'Explain this topic in three sentences in your own words.'};
}

/* ---------- quiz bank ---------- */
const QZ=[
['Which symbol ends a statement in C++?',['.',':',';',','],2,'Every C++ statement ends with a semicolon.'],
['What does return 0; in main() signal?',['An error','The program finished successfully','A loop restart','Nothing at all'],1,'0 is the usual code for success.'],
['What is 7 / 2 when both are int?',['3.5','4','3','2'],2,'Integer division drops the decimal part.'],
['Which header gives you cout and cin?',['<vector>','<iostream>','<string>','<cmath>'],1,'<iostream> handles input and output.'],
['Which flowchart shape shows a decision?',['Rectangle','Oval','Diamond','Arrow'],2,'A diamond has Yes/No exits.'],
['What is 7 % 3?',['2','1','0','3'],1,'7 = 2 × 3 + 1, so the remainder is 1.'],
['What is the index of the first array element?',['0','1','-1','n'],0,'C++ arrays start at index 0.'],
['Worst-case time of linear search on n items?',['O(1)','O(log n)','O(n)','O(n²)'],2,'You may check every item once.'],
['Binary search needs the array to be…',['Sorted','Empty','All positive','Of even length'],0,'Halving only works when order is known.'],
['Why does a recursive function need a base case?',['To run faster','To stop the recursion','To save memory','To print output'],1,'Without it the calls never end.'],
['What does & mean in void f(int &x)?',['Address of x','x is a reference to the caller’s variable','Bitwise and','x is a pointer'],1,'A reference parameter changes the original.'],
['How many times does for (int i = 0; i < 5; i++) run its body?',['4','5','6','Infinite'],1,'i takes 0, 1, 2, 3 and 4.'],
['Which STL container is a resizable array?',['map','pair','vector','stack'],2,'vector grows with push_back.'],
['What is a dry run?',['Compiling without running','Tracing a program by hand with sample values','Deleting old code','Running with no input'],1,'You follow each variable step by step on paper.'],
['A loop inside a loop, each running n times, costs…',['O(n)','O(2n)','O(n²)','O(log n)'],2,'n × n steps.']];
let Q={on:false,list:[],i:0,sel:null,score:0,done:false};

/* ---------- helpers ---------- */
const pad=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const fmt=m=>{m=Math.round(m);const h=Math.floor(m/60),r=m%60;return h?(r?`${h}h ${r}m`:`${h}h`):`${r}m`};
const isDone=t=>!!S.done[t.id];
const dayT=k=>allTasks().filter(t=>t.day===k);
const stat=ts=>{const d=ts.filter(isDone).length;return{total:ts.length,done:d,pct:ts.length?d/ts.length*100:0,must:ts.filter(t=>t.pri==='m'&&!isDone(t)).length,min:ts.reduce((a,t)=>a+t.min,0)}};
function todayKey(){const f=DAYS.find(d=>d.date===iso(new Date()));return f?f.k:null}
function focusDay(){const t=todayKey();if(t)return t;const f=DAYS.find(d=>dayT(d.k).some(x=>!isDone(x)));return f?f.k:'fri'}
function ring(p,sz,sw){sw=sw||8;const r=(sz-sw)/2,c=2*Math.PI*r;return `<svg class="ring" width="${sz}" height="${sz}" viewBox="0 0 ${sz} ${sz}" role="img" aria-label="${Math.round(p)} percent"><circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="var(--line)" stroke-width="${sw}"/><circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="var(--ink)" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-p/100)}" transform="rotate(-90 ${sz/2} ${sz/2})"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" class="ringt" font-size="${Math.round(sz*.22)}">${Math.round(p)}%</text></svg>`}
function toast(msg){const el=document.createElement('div');el.className='toast';el.innerHTML=ic('check')+'<span></span>';el.lastChild.textContent=msg;$('#toasts').appendChild(el);while($('#toasts').children.length>3)$('#toasts').firstChild.remove();setTimeout(()=>el.remove(),2800)}
const chips=t=>`<div class="chips"><span class="chip" style="--c:${PRC[t.pri]}">${PRI[t.pri]}</span><span class="chip" style="--c:${SRCC[t.src]}">${SRC[t.src]}</span><span class="chip neutral">${esc(t.cat)}</span><span class="chip neutral">${ic('clock')}${t.min}m</span></div>`;

/* ---------- render: shell ---------- */
const NAV=[['dashboard','Dashboard','dash'],['fri','Friday Plan','flag'],['sat','Saturday Plan','cal'],['sun','Sunday Plan','sun'],['checklist','Topic Checklist','list'],['revision','Revision & Quiz','rev'],['notes','My Notes','note'],['friends','Friends’ Progress','users'],['prefs','Settings','gear']];
function renderSide(){
  const tk=todayKey();
  $('#side').innerHTML=`<div class="brand"><div class="logo">${ic('cap')}</div><div><b>Zero to C++</b><small>3-day DSA starter plan</small></div></div>
  <nav class="nav" aria-label="Sections">${NAV.map(n=>`<button data-go="${n[0]}" ${S.view===n[0]?'aria-current="page"':''}>${ic(n[2])}<span>${n[1]}</span>${n[0]===tk?'<span class="tag">TODAY</span>':''}</button>`).join('')}</nav>
  <div class="save"><b>Auto-saved</b>Your progress saves automatically in this browser. No login, no subscription.<div style="margin-top:8px"><span class="dot"></span>Saved on this device</div></div>`;
}
function render(){
  renderSide();
  const v=S.view,m=$('#main');
  if(v==='dashboard')m.innerHTML=vDash();
  else if(dayOf(v))m.innerHTML=vDay(v);
  else if(v==='checklist')m.innerHTML=vCheck();
  else if(v==='revision')m.innerHTML=vRev();
  else if(v==='notes')m.innerHTML=vNotes();
  else if(v==='friends')m.innerHTML=vFriends();
  else m.innerHTML=vSettings();
  renderRail();updCd();
}

/* ---------- views ---------- */
function vDash(){
  const all=allTasks(),s=stat(all),fk=focusDay(),fd=dayOf(fk);
  const now=new Date();
  const greet=now.getHours()<12?'Good morning':now.getHours()<17?'Good afternoon':'Good evening';
  const dateStr=now.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
  return `<div><div class="eyebrow">${greet} — ${esc(dateStr)}</div><h1 class="big" style="margin-top:6px">Let's Build Your DSA Foundation!</h1>
  <div class="row" style="margin-top:12px"><span class="chip today">Today's plan: ${fd.name}</span></div></div>
  <div class="row"><button class="btn" data-act="cont">${ic('reset')}Continue Where You Left Off</button><button class="btn dark" data-go="${fk}">Jump to Today's Plan ${ic('arrow')}</button></div>
  ${S.hideWelcome?'':`<section class="card welcome"><div class="eyebrow">New here? Start in 30 seconds</div><h2 class="sec" style="margin-top:6px">Welcome to your 3-day C++ starter plan</h2>
   <ol><li>Open <b>${fd.name}</b> and read the first topic with <b>Start Learning</b>.</li><li><b>Tick the circle</b> when you finish a task. Progress updates by itself.</li><li>Use <b>Mark for Revision</b> for anything that feels hard.</li><li>Add your friends in <b>Friends' Progress</b> to study as a squad.</li></ol>
   <div class="row"><button class="btn dark" data-go="${fk}">Start with ${fd.name} ${ic('arrow')}</button><button class="btn" data-act="hidewelcome">Got it, hide this</button></div></section>`}
  <section class="stats">
   <div class="card stat"><div class="lab">${ic('target')}Overall progress</div><div class="ringbox">${ring(s.pct,84,9)}</div><small style="display:block;margin-top:8px">${Math.round(s.pct)}% of the full plan</small></div>
   <div class="card stat"><div class="lab">${ic('check')}Tasks completed</div><div class="num">${s.done} / ${s.total}</div><small>${s.total-s.done} to go. Steady pace wins.</small></div>
   <div class="card stat"><div class="lab">${ic('clock')}Countdown to Sunday target</div><div class="cd"><div><b id="cd-d">00</b><span>DAYS</span></div><div><b id="cd-h">00</b><span>HRS</span></div><div><b id="cd-m">00</b><span>MINS</span></div><div><b id="cd-s">00</b><span>SECS</span></div></div><small id="cd-t" style="display:block;margin-top:8px"></small></div>
   <div class="card stat"><div class="lab">${ic('clock')}Study time</div><div class="num">${fmt(s.min)}</div><small>planned · ${fmt(S.studyMin)} recorded with the timer</small></div>
  </section>
  <section class="days3">${DAYS.map(d=>{const st=stat(dayT(d.k));return `<button class="daycard ${d.k}" data-go="${d.k}">${d.k===todayKey()?'<span class="tg">TODAY</span>':''}<h3>${d.name}</h3><small>${st.must} must-do left · ${d.label}</small><div class="eyebrow" style="color:inherit;opacity:.8">${esc(d.title)}</div><div class="bar" aria-hidden="true"><i style="width:${st.pct}%"></i></div><small>${st.done}/${st.total} tasks · ${fmt(st.min)}</small></button>`}).join('')}</section>`;
}
function vDay(k){
  const d=dayOf(k),ts=dayT(k),st=stat(ts);
  let list=ts.filter(t=>S.filter==='pending'?!isDone(t):S.filter==='done'?isDone(t):S.filter==='must'?t.pri==='m':true);
  let body='';
  if(!list.length)body=`<div class="card empty">Nothing here for this filter.</div>`;
  else if(S.sort==='pri'){const o={m:0,r:1,o:2};list=list.slice().sort((a,b)=>o[a.pri]-o[b.pri]);body=`<div class="list">${list.map(taskCard).join('')}</div>`}
  else{const seen=[];list.forEach(t=>{if(!seen.includes(t.bi))seen.push(t.bi)});
    body=seen.map(bi=>{const bt=list.filter(t=>t.bi===bi),first=bt[0];const total=dayT(k).filter(t=>t.bi===bi);
      return `<div><div class="blockh">${esc(first.block)}</div><div class="blockn">${total.length} tasks · ${fmt(total.reduce((a,t)=>a+t.min,0))}</div><div class="list">${bt.map(taskCard).join('')}</div></div>`}).join('')}
  return `<section class="dayhead ${k}"><div class="top"><div class="eyebrow" style="color:inherit;opacity:.8">${d.name} — Day ${d.n} of 3 · ${d.month}</div>${k===todayKey()?'<span class="chip" style="--c:var(--btnInk);background:var(--btn)">TODAY</span>':''}</div>
   <h1>${esc(d.title)}</h1><p><b>Goal:</b> ${esc(d.goal)}</p>
   <div class="panel"><div>${ring(st.pct,76,8)}</div><div style="flex:1;min-width:200px;display:grid;gap:8px"><b>${st.done}/${st.total} tasks done · ${st.must} must-do left</b><div class="bar" style="background:var(--line)"><i style="width:${st.pct}%"></i></div><span class="lead">${fmt(st.min)} of focused study planned for ${d.name}.</span></div></div>
   <div class="row"><button class="btn" data-act="copyplan" data-day="${k}">${ic('copy')}Copy plan</button><button class="btn dark" data-act="showadd">${ic('plus')}Add your task</button></div>
   <div id="addbox" hidden class="panel" style="display:block"><div class="formrow"><input class="in" id="nt-title" placeholder="Task title" aria-label="Task title"><input class="in" id="nt-min" type="number" min="5" step="5" value="20" style="max-width:100px;flex:none" aria-label="Minutes"><select class="in" id="nt-pri" aria-label="Priority"><option value="m">Must Complete</option><option value="r">Recommended</option><option value="o">Optional</option></select><button class="btn dark" data-act="addtask" data-day="${k}">Add</button></div></div></section>
  <div class="legend"><span>Priority:</span>${['m','r','o'].map(p=>`<span class="chip" style="--c:${PRC[p]}">${PRI[p]}</span>`).join('')}<span>Source:</span>${['c','g','x'].map(p=>`<span class="chip" style="--c:${SRCC[p]}">${SRC[p]}</span>`).join('')}</div>
  <div class="tools"><div class="tabs" role="group" aria-label="Filter">${[['all','All Tasks'],['pending','Pending'],['done','Completed'],['must','Must Complete']].map(f=>`<button data-act="filter" data-v="${f[0]}" aria-pressed="${S.filter===f[0]}">${f[1]}</button>`).join('')}</div>
   <div class="tabs" role="group" aria-label="Sort"><span class="eyebrow" style="align-self:center">Sort</span>${[['plan','Plan order'],['pri','By priority']].map(f=>`<button data-act="sort" data-v="${f[0]}" aria-pressed="${S.sort===f[0]}">${f[1]}</button>`).join('')}</div></div>
  ${body}`;
}
function taskCard(t){
  const d=isDone(t),r=!!S.rev[t.id];
  return `<article class="task ${d?'is-done':''}" data-id="${esc(t.id)}"><button class="circ" data-act="toggle" aria-pressed="${d}" aria-label="${d?'Mark pending':'Mark done'}: ${esc(t.title)}">${d?ic('check'):''}</button>
  <div class="tb"><div class="trow"><h3>${esc(t.title)}</h3><span class="st">${d?'Done':'Pending'}</span></div><p>${esc(t.desc)}</p>${chips(t)}
  <div class="tact"><button class="btn sm soft" data-act="learn">${ic('book')}Start Learning</button><button class="link ${r?'on':''}" data-act="rev">${ic('mark')}${r?'Marked for Revision':'Mark for Revision'}</button>${t.custom?`<button class="link" data-act="deltask">${ic('trash')}Delete</button>`:''}</div>
  <textarea class="note" data-note="${esc(t.id)}" rows="1" placeholder="Write a note for yourself (optional)…" aria-label="Note for ${esc(t.title)}">${esc(S.notes[t.id]||'')}</textarea></div></article>`;
}
function vCheck(){
  return `<div><div class="eyebrow">Everything in one list</div><h1 class="big" style="margin-top:6px">Topic Checklist</h1></div>`+DAYS.map(d=>{const ts=dayT(d.k),st=stat(ts);
   return `<section class="card ${d.k}"><div class="railhead"><h2 class="sec">${d.name} <span class="lead" style="font-family:var(--sans);font-size:13px">${st.done}/${st.total}</span></h2><button class="btn sm" data-go="${d.k}">Open plan</button></div>
   ${ts.map(t=>`<div class="nrow" data-id="${esc(t.id)}"><button class="circ" data-act="toggle" aria-pressed="${isDone(t)}" aria-label="Toggle ${esc(t.title)}" style="${isDone(t)?'background:var(--green);border-color:var(--green);color:#fff':''}">${isDone(t)?ic('check'):''}</button><span style="${isDone(t)?'text-decoration:line-through;color:var(--mute)':''}">${esc(t.title)}</span><span class="chip" style="--c:${PRC[t.pri]}">${PRI[t.pri]}</span></div>`).join('')}</section>`}).join('');
}
function vRev(){
  const rv=allTasks().filter(t=>S.rev[t.id]);
  let quiz='';
  if(!Q.on)quiz=`<p class="lead">Five random questions from all three days. Your best score is saved.</p><div class="row" style="margin-top:12px"><button class="btn dark" data-act="startquiz">Start a quiz</button>${S.best?`<span class="chip" style="--c:var(--green)">Best ${S.best}/5</span>`:''}</div>`;
  else if(Q.done)quiz=`<h3 class="sec">Score: ${Q.score}/5</h3><p class="lead" style="margin:6px 0 12px">${Q.score>=4?'Strong. Move on to the next topic.':Q.score>=2?'Decent. Mark the weak topics for revision and retry.':'Re-read the lessons, then try again.'}</p><button class="btn dark" data-act="startquiz">Try another round</button>`;
  else{const q=QZ[Q.list[Q.i]];quiz=`<div class="q"><div class="eyebrow">Question ${Q.i+1} of 5</div><h3 style="margin-top:6px">${esc(q[0])}</h3>${q[1].map((o,i)=>`<button class="opt ${Q.sel==null?'':i===q[2]?'right':i===Q.sel?'wrong':''}" data-act="answer" data-i="${i}" ${Q.sel!=null?'disabled':''}>${esc(o)}</button>`).join('')}${Q.sel!=null?`<p class="lead" style="margin:6px 0 12px">${esc(q[3])}</p><button class="btn dark" data-act="nextq">${Q.i===4?'See score':'Next question'}</button>`:''}</div>`}
  return `<div><div class="eyebrow">Spaced practice</div><h1 class="big" style="margin-top:6px">Revision & Quiz</h1></div>
  <section class="card"><div class="railhead"><h2 class="sec">Revision queue</h2><span class="chip neutral">${rv.length} marked</span></div>
  ${rv.length?rv.map(t=>`<div class="nrow" data-id="${esc(t.id)}"><span class="chip" style="--c:var(--amber)">${ic('mark')}</span><span>${esc(t.title)} <small class="lead">· ${dayOf(t.day).name}</small></span><span class="row"><button class="btn sm soft" data-act="learn">${ic('book')}Revise</button><button class="link" data-act="rev" aria-label="Remove from revision">${ic('x')}</button></span></div>`).join(''):`<div class="empty">Nothing marked yet. Use "Mark for Revision" on any task that feels hard.</div>`}</section>
  <section class="card"><h2 class="sec" style="margin-bottom:10px">Quick quiz</h2>${quiz}</section>`;
}
function vNotes(){
  const withN=allTasks().filter(t=>(S.notes[t.id]||'').trim());
  return `<div><div class="eyebrow">Your own words</div><h1 class="big" style="margin-top:6px">My Notes</h1></div>
  <section class="card"><h2 class="sec" style="margin-bottom:10px">Scratchpad</h2><textarea class="note" id="free" rows="6" placeholder="Anything you want to remember: formulas, mistakes, questions for a friend…" aria-label="Scratchpad">${esc(S.free)}</textarea></section>
  <section class="card"><h2 class="sec" style="margin-bottom:6px">Task notes</h2>${withN.length?withN.map(t=>`<div class="nrow" data-id="${esc(t.id)}" style="grid-template-columns:minmax(0,1fr) auto"><div><b>${esc(t.title)}</b> <small class="lead">· ${dayOf(t.day).name}</small><textarea class="note" data-note="${esc(t.id)}" rows="2" style="margin-top:6px" aria-label="Note for ${esc(t.title)}">${esc(S.notes[t.id])}</textarea></div><button class="btn sm" data-act="learn">Open</button></div>`).join(''):`<div class="empty">Notes you write on tasks appear here.</div>`}</section>`;
}
const initials=n=>n.trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'?';
function vFriends(){
  const all=allTasks(),mine=stat(all);
  const people=[{id:'me',name:'You',done:S.done,today:null}].concat(S.squad);
  const cardOf=(p,i)=>{const n=all.filter(t=>p.done[t.id]).length;return `<div class="member"><div class="row" style="flex-wrap:nowrap"><span class="av c${i%4}">${p.id==='me'?'YOU':esc(initials(p.name))}</span><div style="flex:1;min-width:0"><b style="overflow-wrap:anywhere">${esc(p.name)}</b><div class="lead" style="font-size:12px">${n}/${all.length} tasks · ${p.id==='me'?'you':'friend'}</div></div>${ring(all.length?n/all.length*100:0,52,6)}</div>
   ${p.id==='me'?'':`<div class="cnt" data-m="${esc(p.id)}">Today: <b>${p.today}/3</b><span style="flex:1"></span><button data-act="fminus" aria-label="Less">${ic('minus')}</button><button data-act="fplus" aria-label="More">${ic('plus')}</button><button data-act="fdel" aria-label="Remove ${esc(p.name)}">${ic('trash')}</button></div>`}</div>`};
  return `<div><div class="eyebrow">Study as a squad</div><h1 class="big" style="margin-top:6px">Friends' Progress</h1><p class="lead" style="margin-top:6px">Squad data is saved on this device. Tap a person's circle to record that they finished a task.</p></div>
  <section class="card"><div class="sq">${people.map(cardOf).join('')}</div><div class="formrow" style="margin-top:14px"><input class="in" id="fname" placeholder="Friend's name…" aria-label="Friend's name" maxlength="30"><button class="btn dark" data-act="addfriend">${ic('plus')}Add to squad</button></div></section>
  <section class="card" style="padding:20px 0 6px"><h2 class="sec" style="padding:0 20px">Shared checklist: who completed what</h2><p class="lead" style="padding:0 20px 8px">Tap a person's circle to record that they finished the task.</p>
  ${DAYS.map(d=>{const ts=dayT(d.k),touched=ts.filter(t=>people.some(p=>p.done[t.id])).length;return `<details class="dayc ${d.k}" style="margin:10px 12px 0" ${d.k===focusDay()?'open':''}><summary><b>${d.name}</b>${d.k===todayKey()?'<span class="chip today">Today</span>':''}<span class="n">${touched}/${ts.length} touched</span></summary><div style="background:var(--panel)">${ts.map(t=>`<div class="crow" data-t="${esc(t.id)}"><span class="t">${esc(t.title)}</span><span class="cs">${people.map(p=>`<button data-act="ftoggle" data-m="${esc(p.id)}" class="${p.done[t.id]?'on':''}" aria-pressed="${!!p.done[t.id]}" aria-label="${esc(p.name)}: ${esc(t.title)}">${p.done[t.id]?ic('check').replace('class="ic"','class="ic" style="width:14px;height:14px"'):(p.id==='me'?'YOU':esc(initials(p.name)))}</button>`).join('')}</span></div>`).join('')}</div></details>`}).join('')}<div style="height:12px"></div></section>`;
}
function vSettings(){
  return `<div><div class="eyebrow">Make it yours</div><h1 class="big" style="margin-top:6px">Settings</h1></div>
  <section class="card"><div class="setrow"><label for="s-focus"><b>Focus session</b><div class="lead">Minutes per focus round</div></label><input class="in" id="s-focus" type="number" min="5" max="90" value="${S.settings.focus}" style="width:90px"></div>
  <div class="setrow"><label for="s-brk"><b>Break</b><div class="lead">Minutes per break</div></label><input class="in" id="s-brk" type="number" min="1" max="30" value="${S.settings.brk}" style="width:90px"></div>
  <div class="setrow"><label for="s-target"><b>Sunday target</b><div class="lead">The countdown on the dashboard counts down to this time</div></label><input class="in" id="s-target" type="datetime-local" value="${esc(S.settings.target)}"></div>
  <div class="setrow"><div><b>Copy progress summary</b><div class="lead">Paste it to your squad chat</div></div><button class="btn" data-act="copysum">${ic('copy')}Copy</button></div>
  <div class="setrow"><div><b>Reset all progress</b><div class="lead">Clears ticks, notes, revision marks, habits and squad. Cannot be undone.</div></div><span id="rsbox"><button class="btn" data-act="resetask" style="color:var(--red)">Reset progress</button></span></div></section>`;
}

/* ---------- rail ---------- */
const HAB=['Watched or studied the day’s lesson','Solved the day’s coding practice','Wrote a note on one topic','Revised a marked topic','Took a quiz'];
let T={mode:'focus',left:S.settings.focus*60,run:false,iv:null};
const tsecs=()=>(T.mode==='focus'?S.settings.focus:S.settings.brk)*60;
const mmss=s=>pad(Math.floor(s/60))+':'+pad(s%60);
function renderRail(){
  const fk=focusDay(),fd=dayOf(fk),blocks=[];
  PLAN.forEach((b,bi)=>{if(b.day===fk)blocks.push({t:b.title,ts:dayT(fk).filter(t=>t.bi===bi)})});
  const mine=dayT(fk).filter(t=>t.bi===999);if(mine.length)blocks.push({t:'My tasks',ts:mine});
  const hk=iso(new Date()),hv=S.habits[hk]||{},hn=HAB.filter((h,i)=>hv[i]).length;
  $('#rail').innerHTML=`<section class="card railcard"><div class="railhead"><h3>Today's study schedule</h3><span class="chip neutral">${fd.name}</span></div><div class="sch ${fk}">${blocks.map(b=>{const d=b.ts.filter(isDone).length;return `<button data-go="${fk}"><span style="min-width:0"><b>${esc(b.t)}</b><small>${d}/${b.ts.length} tasks</small></span><span class="tm">${fmt(b.ts.reduce((a,t)=>a+t.min,0))}</span></button>`}).join('')}</div></section>
  <section class="card railcard"><div class="railhead"><h3>Focus timer</h3><span class="lead" style="font-size:12px">${S.settings.focus}/${S.settings.brk} min</span></div><span class="mode ${T.mode==='break'?'brk':''}" id="tmode">${T.mode==='focus'?'Focus session':'Break'}</span>
  <div class="timer" id="tmv" role="timer">${mmss(T.left)}</div><div class="bar" style="background:var(--line)"><i id="tmbar" style="width:${(1-T.left/tsecs())*100}%"></i></div>
  <div class="row" style="margin:14px 0 10px"><button class="btn dark" data-act="tstart">${ic(T.run?'pause':'play')}${T.run?'Pause':'Start'}</button><button class="btn" data-act="treset">${ic('reset')}Reset</button></div><button class="btn sm" data-act="tswitch">Switch to ${T.mode==='focus'?'break':'focus'}</button>
  <div class="formrow" style="margin-top:14px"><input class="in" id="recmin" type="number" min="1" placeholder="Minutes" aria-label="Minutes studied without the timer" style="min-width:0"><button class="btn sm" data-act="rectime">Record time</button></div><p class="lead" style="font-size:12px;margin-top:8px">Studied without the timer? Record it here. Total: <b>${fmt(S.studyMin)}</b></p></section>
  <section class="card railcard"><div class="railhead"><h3>Daily habits</h3>${ring(hn/HAB.length*100,48,6)}</div><div class="hab">${HAB.map((h,i)=>`<label class="${hv[i]?'on':''}"><input type="checkbox" data-habit="${i}" ${hv[i]?'checked':''}><span>${esc(h)}</span></label>`).join('')}</div></section>`;
}
function updTimer(){const a=$('#tmv'),b=$('#tmbar');if(a)a.textContent=mmss(T.left);if(b)b.style.width=((1-T.left/tsecs())*100)+'%'}
function stopTimer(){clearInterval(T.iv);T.iv=null;T.run=false}
function tick(){
  T.left--;
  if(T.mode==='focus'&&(tsecs()-T.left)%60===0){S.studyMin++;save()}
  if(T.left<=0){const was=T.mode;stopTimer();T.mode=was==='focus'?'break':'focus';T.left=tsecs();toast(was==='focus'?'Focus round done. Take a break.':'Break over. Ready to focus?');render();return}
  updTimer();
}
function updCd(){
  const e=$('#cd-d');if(!e)return;
  const tg=new Date(S.settings.target),ms=Math.max(0,tg-new Date());
  const d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),m=Math.floor(ms%36e5/6e4),s=Math.floor(ms%6e4/1e3);
  $('#cd-d').textContent=pad(d);$('#cd-h').textContent=pad(h);$('#cd-m').textContent=pad(m);$('#cd-s').textContent=pad(s);
  $('#cd-t').textContent=isNaN(tg)?'':'Target: '+tg.toLocaleString('en-US',{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});
}
setInterval(updCd,1000);

/* ---------- drawer ---------- */
function openLesson(id){
  const t=byId(id);if(!t)return;const l=lessonFor(t),r=!!S.rev[t.id],d=isDone(t);
  const dr=$('#drawer');
  dr.innerHTML=`<div class="dh"><div><div class="eyebrow">Start Learning · ${esc(t.cat)}</div><h2>${esc(t.title)}</h2></div><button class="xbtn" data-act="closedr" aria-label="Close">${ic('x')}</button></div>
  <div class="db" data-id="${esc(t.id)}"><div><div class="eyebrow">Concept explanation</div><p style="margin-top:6px">${esc(l.e)}</p>${l.b?`<ul style="margin-top:8px">${l.b.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}</div>
  ${l.a?`<div class="ana"><div class="eyebrow">Real-world analogy</div><p style="margin-top:4px">${esc(l.a)}</p></div>`:''}
  ${l.c?`<div><div class="row" style="justify-content:space-between"><div class="eyebrow">${t.cat==='Coding Practice'?'Sample solution idea':'C++ example'}</div><button class="btn sm" data-act="copycode">${ic('copy')}Copy code</button></div><pre class="code" id="codeblk"></pre></div>`:''}
  ${l.o?`<div><div class="eyebrow">Expected output</div><pre class="code" id="outblk" style="margin-top:6px"></pre></div>`:''}
  ${l.q?`<div class="pq"><div class="eyebrow">Practice question</div><p style="margin-top:4px">${esc(l.q)}</p></div>`:''}
  <div class="row"><button class="btn dark" data-act="${l.quiz?'gotoquiz':'toggle'}" ${l.quiz?'':'data-close="1"'}>${l.quiz?'Open Revision & Quiz':(d?'Mark as pending':'Mark complete')}</button><button class="btn" data-act="rev">${ic('mark')}${r?'Marked for Revision':'Mark for Revision'}</button></div></div>`;
  if(l.c)$('#codeblk').textContent=l.c;if(l.o)$('#outblk').textContent=l.o;
  dr.classList.add('on');dr.setAttribute('aria-hidden','false');$('#scrim').classList.add('on');dr.scrollTop=0;dr._id=id;
}
function closeDrawer(){$('#drawer').classList.remove('on');$('#drawer').setAttribute('aria-hidden','true');$('#scrim').classList.remove('on');$('#side').classList.remove('on')}

/* ---------- actions ---------- */
function go(v){S.view=v;save();closeDrawer();render();window.scrollTo(0,0)}
function toggleTask(id){const t=byId(id);if(!t)return;if(S.done[id]){delete S.done[id];toast('Marked as pending.')}else{S.done[id]=1;toast(`Nice! "${t.title}" completed.`)}save()}
function toggleRev(id){const t=byId(id);if(!t)return;if(S.rev[id]){delete S.rev[id];toast('Removed from your revision queue.')}else{S.rev[id]=1;toast('Added to your revision queue.')}save()}
function planText(k){const d=dayOf(k);return `${d.name} (${d.label}): ${d.title}\n`+dayT(k).map(t=>`${isDone(t)?'[x]':'[ ]'} ${t.title} (${t.min}m)`).join('\n')}
async function copy(txt,ok){try{await navigator.clipboard.writeText(txt);toast(ok)}catch(e){toast('Copy is blocked here. Select the text and copy it manually.')}}
document.addEventListener('click',e=>{
  if(e.target.id==='scrim'){closeDrawer();return}
  const g=e.target.closest('[data-go]');if(g){go(g.dataset.go);return}
  const a=e.target.closest('[data-act]');if(!a)return;
  const act=a.dataset.act,host=a.closest('[data-id]'),id=host?host.dataset.id:null;
  const redraw=()=>{render();if($('#drawer').classList.contains('on')&&$('#drawer')._id)openLesson($('#drawer')._id)};
  switch(act){
   case 'menu':$('#side').classList.add('on');$('#scrim').classList.add('on');break;
   case 'today':go(focusDay());break;
   case 'cont':{const t=allTasks().find(x=>!isDone(x));if(t){go(t.day);toast('Next up: '+t.title)}else toast('Everything is done. Great work!');break}
   case 'hidewelcome':S.hideWelcome=true;save();render();break;
   case 'toggle':toggleTask(id);if(a.dataset.close)closeDrawer();redraw();break;
   case 'rev':toggleRev(id);redraw();break;
   case 'learn':openLesson(id);break;
   case 'closedr':closeDrawer();break;
   case 'gotoquiz':closeDrawer();go('revision');break;
   case 'copycode':copy($('#codeblk').textContent,'Code copied.');break;
   case 'filter':S.filter=a.dataset.v;save();render();break;
   case 'sort':S.sort=a.dataset.v;save();render();break;
   case 'copyplan':copy(planText(a.dataset.day),'Plan copied.');break;
   case 'showadd':{const b=$('#addbox');b.hidden=!b.hidden;if(!b.hidden)$('#nt-title').focus();break}
   case 'addtask':{const ti=$('#nt-title').value.trim();if(!ti){toast('Give the task a title first.');break}
     S.custom.push({id:'c'+Date.now(),day:a.dataset.day,title:ti.slice(0,80),desc:'Your own task.',pri:$('#nt-pri').value,min:Math.max(5,parseInt($('#nt-min').value)||20),custom:true});save();toast('Task added.');render();break}
   case 'deltask':S.custom=S.custom.filter(c=>c.id!==id);delete S.done[id];delete S.rev[id];delete S.notes[id];save();render();break;
   case 'startquiz':{const idx=QZ.map((_,i)=>i).sort(()=>Math.random()-.5).slice(0,5);Q={on:true,list:idx,i:0,sel:null,score:0,done:false};render();break}
   case 'answer':{if(Q.sel!=null)break;Q.sel=+a.dataset.i;if(Q.sel===QZ[Q.list[Q.i]][2])Q.score++;render();break}
   case 'nextq':{if(Q.i===4){Q.done=true;if(Q.score>S.best){S.best=Q.score;save()}hab(4,true)}else{Q.i++;Q.sel=null}render();break}
   case 'addfriend':{const n=$('#fname').value.trim();if(!n){toast('Type a name first.');break}S.squad.push({id:'f'+Date.now(),name:n.slice(0,30),done:{},today:0});save();render();toast(n+' joined the squad');break}
   case 'fplus':case 'fminus':{const m=S.squad.find(x=>x.id===a.closest('[data-m]').dataset.m);if(m){m.today=Math.max(0,Math.min(3,m.today+(act==='fplus'?1:-1)));save();render()}break}
   case 'fdel':{const m=S.squad.find(x=>x.id===a.closest('[data-m]').dataset.m);S.squad=S.squad.filter(x=>x!==m);save();render();if(m)toast(m.name+' left the squad');break}
   case 'ftoggle':{const tid=a.closest('[data-t]').dataset.t,mid=a.dataset.m;const tgt=mid==='me'?S.done:(S.squad.find(x=>x.id===mid)||{}).done;if(tgt){if(tgt[tid])delete tgt[tid];else tgt[tid]=1;save();render()}break}
   case 'tstart':if(T.run){stopTimer()}else{T.run=true;T.iv=setInterval(tick,1000)}renderRail();break;
   case 'treset':stopTimer();T.left=tsecs();renderRail();break;
   case 'tswitch':stopTimer();T.mode=T.mode==='focus'?'break':'focus';T.left=tsecs();renderRail();break;
   case 'rectime':{const v=parseInt($('#recmin').value);if(!v||v<1){toast('Enter the minutes you studied.');break}S.studyMin+=v;save();toast(`Recorded ${v} min of study time.`);render();break}
   case 'copysum':{const s=stat(allTasks());copy(`Zero to C++ progress: ${s.done}/${s.total} tasks (${Math.round(s.pct)}%), ${fmt(S.studyMin)} studied.`,'Summary copied.');break}
   case 'resetask':$('#rsbox').innerHTML=`<button class="btn" data-act="resetyes" style="background:var(--red);color:#fff;border-color:var(--red)">Yes, reset everything</button> <button class="btn" data-act="resetno">Keep it</button>`;break;
   case 'resetno':render();break;
   case 'resetyes':{const keep=S.settings;S=def();S.settings=keep;S.view='dashboard';save();stopTimer();T.mode='focus';T.left=tsecs();render();toast('Progress reset. Fresh start!');break}
  }
});
function hab(i,on){const k=iso(new Date());S.habits[k]=S.habits[k]||{};S.habits[k][i]=on;save()}
document.addEventListener('input',e=>{
  const n=e.target.closest('[data-note]');if(n){const v=n.value;if(v.trim())S.notes[n.dataset.note]=v;else delete S.notes[n.dataset.note];save();return}
  if(e.target.id==='free'){S.free=e.target.value;save()}
});
document.addEventListener('change',e=>{
  const h=e.target.closest('[data-habit]');if(h){hab(+h.dataset.habit,h.checked);renderRail();return}
  const id=e.target.id;
  if(id==='s-focus'||id==='s-brk'){const v=Math.max(1,Math.min(90,parseInt(e.target.value)||25));S.settings[id==='s-focus'?'focus':'brk']=v;save();if(!T.run){T.left=tsecs()}renderRail();toast('Timer updated.')}
  if(id==='s-target'&&e.target.value){S.settings.target=e.target.value;save();updCd();toast('Target updated.')}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});
if(!NAV.some(n=>n[0]===S.view))S.view='dashboard';
T.left=tsecs();
render();
