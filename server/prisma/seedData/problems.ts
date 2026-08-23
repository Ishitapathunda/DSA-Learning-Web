// Seed data for the problem catalog. This is the same 55 problems that
// previously lived hard-coded in src/pages/Problems.jsx, now expanded with
// the fields the platform needs for a real problem-solving experience
// (examples, constraints, starter code). Nothing here was deleted from
// the original list — topics/titles/difficulties/descriptions are preserved.

export interface SeedExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface SeedTestCase {
  input: string;
  expectedOutput: string;
}

export interface SeedProblem {
  slug: string;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  examples: SeedExample[];
  constraints: string[];
  starterCode: { cpp: string };
  // Only present for problems wired up for real judged execution (Phase 4).
  // Format: stdin the program reads, and the exact stdout it must produce
  // (compared after trimming whitespace).
  testCases?: SeedTestCase[];
}

const cppStub = (signature: string) =>
  `class Solution {\npublic:\n    ${signature} {\n        // your code here\n    }\n};`;

const twoSumRunnable = `#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // your code here
    return {};
}

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target;
    cin >> target;
    vector<int> result = twoSum(nums, target);
    for (size_t i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i + 1 < result.size()) cout << " ";
    }
    cout << endl;
    return 0;
}`;

export const problems: SeedProblem[] = [
  // ---------------------------- Easy ----------------------------
  {
    slug: "two-sum",
    title: "Two Sum",
    topic: "Arrays",
    difficulty: "Easy",
    description: "Find two numbers that add up to target",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] == 9" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Exactly one valid answer exists"],
    starterCode: { cpp: twoSumRunnable },
    testCases: [
      { input: "4\n2 7 11 15\n9", expectedOutput: "0 1" },
      { input: "3\n3 2 4\n6", expectedOutput: "1 2" },
      { input: "2\n3 3\n6", expectedOutput: "0 1" },
    ],
  },
  {
    slug: "reverse-string",
    title: "Reverse String",
    topic: "Strings",
    difficulty: "Easy",
    description: "Reverse a string in-place",
    examples: [{ input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' }],
    constraints: ["1 <= s.length <= 10^5", "Modify the array in-place with O(1) extra memory"],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

void reverseString(vector<char>& s) {
    // your code here
}

int main() {
    string line;
    getline(cin, line);
    vector<char> s(line.begin(), line.end());
    reverseString(s);
    for (char c : s) cout << c;
    cout << endl;
    return 0;
}`,
    },
    testCases: [
      { input: "hello", expectedOutput: "olleh" },
      { input: "Hannah", expectedOutput: "hannaH" },
    ],
  },
  {
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    topic: "Strings",
    difficulty: "Easy",
    description: "Check if parentheses are valid",
    examples: [
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
    ],
    constraints: ["1 <= s.length <= 10^4", 's consists only of "()[]{}"'],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

bool isValid(string s) {
    // your code here
    return false;
}

int main() {
    string s;
    getline(cin, s);
    cout << (isValid(s) ? "true" : "false") << endl;
    return 0;
}`,
    },
    testCases: [
      { input: "()[]{}", expectedOutput: "true" },
      { input: "(]", expectedOutput: "false" },
      { input: "([)]", expectedOutput: "false" },
    ],
  },
  {
    slug: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    topic: "Arrays",
    difficulty: "Easy",
    description: "Find maximum profit from stock prices",
    examples: [{ input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2, sell on day 5" }],
    constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int maxProfit(vector<int>& prices) {
    // your code here
    return 0;
}

int main() {
    int n;
    cin >> n;
    vector<int> prices(n);
    for (int i = 0; i < n; i++) cin >> prices[i];
    cout << maxProfit(prices) << endl;
    return 0;
}`,
    },
    testCases: [
      { input: "6\n7 1 5 3 6 4", expectedOutput: "5" },
      { input: "5\n7 6 4 3 1", expectedOutput: "0" },
    ],
  },
  {
    slug: "contains-duplicate",
    title: "Contains Duplicate",
    topic: "Arrays",
    difficulty: "Easy",
    description: "Check if array contains duplicates",
    examples: [
      { input: "nums = [1,2,3,1]", output: "true" },
      { input: "nums = [1,2,3,4]", output: "false" },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

bool containsDuplicate(vector<int>& nums) {
    // your code here
    return false;
}

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    cout << (containsDuplicate(nums) ? "true" : "false") << endl;
    return 0;
}`,
    },
    testCases: [
      { input: "4\n1 2 3 1", expectedOutput: "true" },
      { input: "4\n1 2 3 4", expectedOutput: "false" },
    ],
  },
  {
    slug: "valid-anagram",
    title: "Valid Anagram",
    topic: "Strings",
    difficulty: "Easy",
    description: "Check if two strings are anagrams",
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: "true" },
      { input: 's = "rat", t = "car"', output: "false" },
    ],
    constraints: ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters"],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

bool isAnagram(string s, string t) {
    // your code here
    return false;
}

int main() {
    string s, t;
    getline(cin, s);
    getline(cin, t);
    cout << (isAnagram(s, t) ? "true" : "false") << endl;
    return 0;
}`,
    },
    testCases: [
      { input: "anagram\nnagaram", expectedOutput: "true" },
      { input: "rat\ncar", expectedOutput: "false" },
    ],
  },
  {
    slug: "maximum-subarray",
    title: "Maximum Subarray",
    topic: "Arrays",
    difficulty: "Easy",
    description: "Find maximum sum subarray",
    examples: [{ input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "[4,-1,2,1] has the largest sum" }],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int maxSubArray(vector<int>& nums) {
    // your code here
    return 0;
}

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    cout << maxSubArray(nums) << endl;
    return 0;
}`,
    },
    testCases: [
      { input: "9\n-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" },
      { input: "1\n1", expectedOutput: "1" },
    ],
  },
  {
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    topic: "Dynamic Programming",
    difficulty: "Easy",
    description: "Count ways to climb n stairs",
    examples: [{ input: "n = 3", output: "3", explanation: "1+1+1, 1+2, 2+1" }],
    constraints: ["1 <= n <= 45"],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int climbStairs(int n) {
    // your code here
    return 0;
}

int main() {
    int n;
    cin >> n;
    cout << climbStairs(n) << endl;
    return 0;
}`,
    },
    testCases: [
      { input: "2", expectedOutput: "2" },
      { input: "3", expectedOutput: "3" },
      { input: "5", expectedOutput: "8" },
    ],
  },
  {
    slug: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    topic: "Linked Lists",
    difficulty: "Easy",
    description: "Merge two sorted linked lists",
    examples: [{ input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" }],
    constraints: ["The number of nodes in both lists is in the range [0, 50]", "-100 <= Node.val <= 100"],
    starterCode: { cpp: cppStub("ListNode* mergeTwoLists(ListNode* list1, ListNode* list2)") },
  },
  {
    slug: "binary-tree-inorder-traversal",
    title: "Binary Tree Inorder Traversal",
    topic: "Trees",
    difficulty: "Easy",
    description: "Traverse binary tree in-order",
    examples: [{ input: "root = [1,null,2,3]", output: "[1,3,2]" }],
    constraints: ["The number of nodes in the tree is in the range [0, 100]"],
    starterCode: { cpp: cppStub("vector<int> inorderTraversal(TreeNode* root)") },
  },
  {
    slug: "symmetric-tree",
    title: "Symmetric Tree",
    topic: "Trees",
    difficulty: "Easy",
    description: "Check if tree is symmetric",
    examples: [
      { input: "root = [1,2,2,3,4,4,3]", output: "true" },
      { input: "root = [1,2,2,null,3,null,3]", output: "false" },
    ],
    constraints: ["The number of nodes in the tree is in the range [1, 1000]"],
    starterCode: { cpp: cppStub("bool isSymmetric(TreeNode* root)") },
  },
  {
    slug: "maximum-depth-of-binary-tree",
    title: "Maximum Depth of Binary Tree",
    topic: "Trees",
    difficulty: "Easy",
    description: "Find maximum depth of tree",
    examples: [{ input: "root = [3,9,20,null,null,15,7]", output: "3" }],
    constraints: ["The number of nodes in the tree is in the range [0, 10^4]"],
    starterCode: { cpp: cppStub("int maxDepth(TreeNode* root)") },
  },
  {
    slug: "same-tree",
    title: "Same Tree",
    topic: "Trees",
    difficulty: "Easy",
    description: "Check if two trees are identical",
    examples: [{ input: "p = [1,2,3], q = [1,2,3]", output: "true" }],
    constraints: ["The number of nodes in both trees is in the range [0, 100]"],
    starterCode: { cpp: cppStub("bool isSameTree(TreeNode* p, TreeNode* q)") },
  },
  {
    slug: "invert-binary-tree",
    title: "Invert Binary Tree",
    topic: "Trees",
    difficulty: "Easy",
    description: "Invert a binary tree",
    examples: [{ input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" }],
    constraints: ["The number of nodes in the tree is in the range [0, 100]"],
    starterCode: { cpp: cppStub("TreeNode* invertTree(TreeNode* root)") },
  },
  {
    slug: "path-sum",
    title: "Path Sum",
    topic: "Trees",
    difficulty: "Easy",
    description: "Check if path sum exists",
    examples: [{ input: "root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22", output: "true" }],
    constraints: ["The number of nodes in the tree is in the range [0, 5000]"],
    starterCode: { cpp: cppStub("bool hasPathSum(TreeNode* root, int targetSum)") },
  },

  // ---------------------------- Medium ----------------------------
  {
    slug: "add-two-numbers",
    title: "Add Two Numbers",
    topic: "Linked Lists",
    difficulty: "Medium",
    description: "Add two numbers represented as linked lists",
    examples: [{ input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]", explanation: "342 + 465 = 807" }],
    constraints: ["The number of nodes in each list is in the range [1, 100]", "0 <= Node.val <= 9"],
    starterCode: { cpp: cppStub("ListNode* addTwoNumbers(ListNode* l1, ListNode* l2)") },
  },
  {
    slug: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    topic: "Strings",
    difficulty: "Medium",
    description: "Find longest unique substring",
    examples: [{ input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc"' }],
    constraints: ["0 <= s.length <= 5 * 10^4"],
    starterCode: { cpp: cppStub("int lengthOfLongestSubstring(string s)") },
  },
  {
    slug: "longest-palindromic-substring",
    title: "Longest Palindromic Substring",
    topic: "Strings",
    difficulty: "Medium",
    description: "Find longest palindrome substring",
    examples: [{ input: 's = "babad"', output: '"bab"', explanation: '"aba" is also a valid answer' }],
    constraints: ["1 <= s.length <= 1000"],
    starterCode: { cpp: cppStub("string longestPalindrome(string s)") },
  },
  {
    slug: "container-with-most-water",
    title: "Container With Most Water",
    topic: "Arrays",
    difficulty: "Medium",
    description: "Find container with maximum water",
    examples: [{ input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" }],
    constraints: ["2 <= height.length <= 10^5", "0 <= height[i] <= 10^4"],
    starterCode: { cpp: cppStub("int maxArea(vector<int>& height)") },
  },
  {
    slug: "3sum",
    title: "3Sum",
    topic: "Arrays",
    difficulty: "Medium",
    description: "Find all unique triplets that sum to zero",
    examples: [{ input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" }],
    constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
    starterCode: { cpp: cppStub("vector<vector<int>> threeSum(vector<int>& nums)") },
  },
  {
    slug: "remove-nth-node-from-end",
    title: "Remove Nth Node From End",
    topic: "Linked Lists",
    difficulty: "Medium",
    description: "Remove nth node from end of list",
    examples: [{ input: "head = [1,2,3,4,5], n = 2", output: "[1,2,3,5]" }],
    constraints: ["The number of nodes in the list is sz", "1 <= sz <= 30"],
    starterCode: { cpp: cppStub("ListNode* removeNthFromEnd(ListNode* head, int n)") },
  },
  {
    slug: "swap-nodes-in-pairs",
    title: "Swap Nodes in Pairs",
    topic: "Linked Lists",
    difficulty: "Medium",
    description: "Swap every two adjacent nodes",
    examples: [{ input: "head = [1,2,3,4]", output: "[2,1,4,3]" }],
    constraints: ["The number of nodes in the list is in the range [0, 100]"],
    starterCode: { cpp: cppStub("ListNode* swapPairs(ListNode* head)") },
  },
  {
    slug: "rotate-list",
    title: "Rotate List",
    topic: "Linked Lists",
    difficulty: "Medium",
    description: "Rotate linked list to the right",
    examples: [{ input: "head = [1,2,3,4,5], k = 2", output: "[4,5,1,2,3]" }],
    constraints: ["The number of nodes in the list is in the range [0, 500]"],
    starterCode: { cpp: cppStub("ListNode* rotateRight(ListNode* head, int k)") },
  },
  {
    slug: "binary-tree-level-order-traversal",
    title: "Binary Tree Level Order Traversal",
    topic: "Trees",
    difficulty: "Medium",
    description: "Traverse tree level by level",
    examples: [{ input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" }],
    constraints: ["The number of nodes in the tree is in the range [0, 2000]"],
    starterCode: { cpp: cppStub("vector<vector<int>> levelOrder(TreeNode* root)") },
  },
  {
    slug: "construct-binary-tree-from-preorder",
    title: "Construct Binary Tree from Preorder",
    topic: "Trees",
    difficulty: "Medium",
    description: "Build tree from preorder traversal",
    examples: [{ input: "preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]", output: "[3,9,20,null,null,15,7]" }],
    constraints: ["1 <= preorder.length <= 3000"],
    starterCode: { cpp: cppStub("TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder)") },
  },
  {
    slug: "validate-binary-search-tree",
    title: "Validate Binary Search Tree",
    topic: "Trees",
    difficulty: "Medium",
    description: "Check if tree is valid BST",
    examples: [
      { input: "root = [2,1,3]", output: "true" },
      { input: "root = [5,1,4,null,null,3,6]", output: "false" },
    ],
    constraints: ["The number of nodes in the tree is in the range [1, 10^4]"],
    starterCode: { cpp: cppStub("bool isValidBST(TreeNode* root)") },
  },
  {
    slug: "lowest-common-ancestor",
    title: "Lowest Common Ancestor",
    topic: "Trees",
    difficulty: "Medium",
    description: "Find LCA of two nodes",
    examples: [{ input: "root = [3,5,1,6,2,0,8], p = 5, q = 1", output: "3" }],
    constraints: ["The number of nodes in the tree is in the range [2, 10^5]"],
    starterCode: { cpp: cppStub("TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q)") },
  },
  {
    slug: "binary-tree-zigzag-level-order",
    title: "Binary Tree Zigzag Level Order",
    topic: "Trees",
    difficulty: "Medium",
    description: "Zigzag level order traversal",
    examples: [{ input: "root = [3,9,20,null,null,15,7]", output: "[[3],[20,9],[15,7]]" }],
    constraints: ["The number of nodes in the tree is in the range [0, 2000]"],
    starterCode: { cpp: cppStub("vector<vector<int>> zigzagLevelOrder(TreeNode* root)") },
  },
  {
    slug: "number-of-islands",
    title: "Number of Islands",
    topic: "Graphs",
    difficulty: "Medium",
    description: "Count number of islands in grid",
    examples: [{ input: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]', output: "2" }],
    constraints: ["1 <= grid.length, grid[i].length <= 300"],
    starterCode: { cpp: cppStub("int numIslands(vector<vector<char>>& grid)") },
  },
  {
    slug: "clone-graph",
    title: "Clone Graph",
    topic: "Graphs",
    difficulty: "Medium",
    description: "Deep clone an undirected graph",
    examples: [{ input: "adjList = [[2,4],[1,3],[2,4],[1,3]]", output: "[[2,4],[1,3],[2,4],[1,3]]" }],
    constraints: ["The number of nodes is in the range [0, 100]"],
    starterCode: { cpp: cppStub("Node* cloneGraph(Node* node)") },
  },
  {
    slug: "course-schedule",
    title: "Course Schedule",
    topic: "Graphs",
    difficulty: "Medium",
    description: "Check if courses can be completed",
    examples: [{ input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" }],
    constraints: ["1 <= numCourses <= 2000"],
    starterCode: { cpp: cppStub("bool canFinish(int numCourses, vector<vector<int>>& prerequisites)") },
  },
  {
    slug: "word-search",
    title: "Word Search",
    topic: "Graphs",
    difficulty: "Medium",
    description: "Find word in 2D board",
    examples: [{ input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: "true" }],
    constraints: ["1 <= board.length, board[i].length <= 6"],
    starterCode: { cpp: cppStub("bool exist(vector<vector<char>>& board, string word)") },
  },
  {
    slug: "coin-change",
    title: "Coin Change",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    description: "Minimum coins to make amount",
    examples: [{ input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1" }],
    constraints: ["1 <= coins.length <= 12", "0 <= amount <= 10^4"],
    starterCode: { cpp: cppStub("int coinChange(vector<int>& coins, int amount)") },
  },
  {
    slug: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    description: "Find length of longest LIS",
    examples: [{ input: "nums = [10,9,2,5,3,7,101,18]", output: "4", explanation: "[2,3,7,101]" }],
    constraints: ["1 <= nums.length <= 2500"],
    starterCode: { cpp: cppStub("int lengthOfLIS(vector<int>& nums)") },
  },
  {
    slug: "house-robber",
    title: "House Robber",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    description: "Maximum money without robbing adjacent",
    examples: [{ input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 1 and 3" }],
    constraints: ["1 <= nums.length <= 100"],
    starterCode: { cpp: cppStub("int rob(vector<int>& nums)") },
  },
  {
    slug: "unique-paths",
    title: "Unique Paths",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    description: "Count unique paths in grid",
    examples: [{ input: "m = 3, n = 7", output: "28" }],
    constraints: ["1 <= m, n <= 100"],
    starterCode: { cpp: cppStub("int uniquePaths(int m, int n)") },
  },
  {
    slug: "jump-game",
    title: "Jump Game",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    description: "Can you reach the last index?",
    examples: [
      { input: "nums = [2,3,1,1,4]", output: "true" },
      { input: "nums = [3,2,1,0,4]", output: "false" },
    ],
    constraints: ["1 <= nums.length <= 10^4"],
    starterCode: { cpp: cppStub("bool canJump(vector<int>& nums)") },
  },
  {
    slug: "merge-intervals",
    title: "Merge Intervals",
    topic: "Arrays",
    difficulty: "Medium",
    description: "Merge overlapping intervals",
    examples: [{ input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" }],
    constraints: ["1 <= intervals.length <= 10^4"],
    starterCode: { cpp: cppStub("vector<vector<int>> merge(vector<vector<int>>& intervals)") },
  },
  {
    slug: "group-anagrams",
    title: "Group Anagrams",
    topic: "Strings",
    difficulty: "Medium",
    description: "Group strings that are anagrams",
    examples: [{ input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }],
    constraints: ["1 <= strs.length <= 10^4"],
    starterCode: { cpp: cppStub("vector<vector<string>> groupAnagrams(vector<string>& strs)") },
  },
  {
    slug: "sort-colors",
    title: "Sort Colors",
    topic: "Sorting",
    difficulty: "Medium",
    description: "Sort array of 0s, 1s, and 2s",
    examples: [{ input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" }],
    constraints: ["n == nums.length", "1 <= n <= 300"],
    starterCode: { cpp: cppStub("void sortColors(vector<int>& nums)") },
  },

  // ---------------------------- Hard ----------------------------
  {
    slug: "merge-k-sorted-lists",
    title: "Merge k Sorted Lists",
    topic: "Linked Lists",
    difficulty: "Hard",
    description: "Merge k sorted linked lists",
    examples: [{ input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" }],
    constraints: ["k == lists.length", "0 <= k <= 10^4"],
    starterCode: { cpp: cppStub("ListNode* mergeKLists(vector<ListNode*>& lists)") },
  },
  {
    slug: "reverse-nodes-in-k-group",
    title: "Reverse Nodes in k-Group",
    topic: "Linked Lists",
    difficulty: "Hard",
    description: "Reverse nodes in groups of k",
    examples: [{ input: "head = [1,2,3,4,5], k = 2", output: "[2,1,4,3,5]" }],
    constraints: ["The number of nodes is n", "1 <= k <= n <= 5000"],
    starterCode: { cpp: cppStub("ListNode* reverseKGroup(ListNode* head, int k)") },
  },
  {
    slug: "serialize-and-deserialize-binary-tree",
    title: "Serialize and Deserialize Binary Tree",
    topic: "Trees",
    difficulty: "Hard",
    description: "Serialize/deserialize binary tree",
    examples: [{ input: "root = [1,2,3,null,null,4,5]", output: "[1,2,3,null,null,4,5]" }],
    constraints: ["The number of nodes in the tree is in the range [0, 10^4]"],
    starterCode: {
      cpp: `class Codec {\npublic:\n    string serialize(TreeNode* root) {\n        // your code here\n    }\n\n    TreeNode* deserialize(string data) {\n        // your code here\n    }\n};`,
    },
  },
  {
    slug: "binary-tree-maximum-path-sum",
    title: "Binary Tree Maximum Path Sum",
    topic: "Trees",
    difficulty: "Hard",
    description: "Find maximum path sum in tree",
    examples: [{ input: "root = [-10,9,20,null,null,15,7]", output: "42" }],
    constraints: ["The number of nodes in the tree is in the range [1, 3 * 10^4]"],
    starterCode: { cpp: cppStub("int maxPathSum(TreeNode* root)") },
  },
  {
    slug: "word-ladder",
    title: "Word Ladder",
    topic: "Graphs",
    difficulty: "Hard",
    description: "Shortest transformation sequence",
    examples: [{ input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: "5" }],
    constraints: ["1 <= beginWord.length <= 10"],
    starterCode: { cpp: cppStub("int ladderLength(string beginWord, string endWord, vector<string>& wordList)") },
  },
  {
    slug: "alien-dictionary",
    title: "Alien Dictionary",
    topic: "Graphs",
    difficulty: "Hard",
    description: "Find alien language order",
    examples: [{ input: 'words = ["wrt","wrf","er","ett","rftt"]', output: '"wertf"' }],
    constraints: ["1 <= words.length <= 100"],
    starterCode: { cpp: cppStub("string alienOrder(vector<string>& words)") },
  },
  {
    slug: "edit-distance",
    title: "Edit Distance",
    topic: "Dynamic Programming",
    difficulty: "Hard",
    description: "Minimum operations to convert string",
    examples: [{ input: 'word1 = "horse", word2 = "ros"', output: "3" }],
    constraints: ["0 <= word1.length, word2.length <= 500"],
    starterCode: { cpp: cppStub("int minDistance(string word1, string word2)") },
  },
  {
    slug: "regular-expression-matching",
    title: "Regular Expression Matching",
    topic: "Dynamic Programming",
    difficulty: "Hard",
    description: "Match pattern with string",
    examples: [{ input: 's = "aa", p = "a*"', output: "true" }],
    constraints: ["1 <= s.length <= 20", "1 <= p.length <= 30"],
    starterCode: { cpp: cppStub("bool isMatch(string s, string p)") },
  },
  {
    slug: "wildcard-matching",
    title: "Wildcard Matching",
    topic: "Dynamic Programming",
    difficulty: "Hard",
    description: "Match pattern with wildcards",
    examples: [{ input: 's = "adceb", p = "*a*b"', output: "true" }],
    constraints: ["0 <= s.length, p.length <= 2000"],
    starterCode: { cpp: cppStub("bool isMatch(string s, string p)") },
  },
  {
    slug: "trapping-rain-water",
    title: "Trapping Rain Water",
    topic: "Arrays",
    difficulty: "Hard",
    description: "Calculate trapped rainwater",
    examples: [{ input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" }],
    constraints: ["1 <= height.length <= 2 * 10^4"],
    starterCode: { cpp: cppStub("int trap(vector<int>& height)") },
  },
  {
    slug: "first-missing-positive",
    title: "First Missing Positive",
    topic: "Arrays",
    difficulty: "Hard",
    description: "Find first missing positive integer",
    examples: [{ input: "nums = [3,4,-1,1]", output: "2" }],
    constraints: ["1 <= nums.length <= 10^5"],
    starterCode: { cpp: cppStub("int firstMissingPositive(vector<int>& nums)") },
  },
  {
    slug: "n-queens",
    title: "N-Queens",
    topic: "Backtracking",
    difficulty: "Hard",
    description: "Place n queens on chessboard",
    examples: [{ input: "n = 4", output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]' }],
    constraints: ["1 <= n <= 9"],
    starterCode: { cpp: cppStub("vector<vector<string>> solveNQueens(int n)") },
  },
  {
    slug: "sudoku-solver",
    title: "Sudoku Solver",
    topic: "Backtracking",
    difficulty: "Hard",
    description: "Solve 9x9 sudoku puzzle",
    examples: [{ input: "board = 9x9 grid with '.' for empty cells", output: "board filled in-place with a valid solution" }],
    constraints: ["board.length == 9", "board[i].length == 9"],
    starterCode: { cpp: cppStub("void solveSudoku(vector<vector<char>>& board)") },
  },
  {
    slug: "longest-valid-parentheses",
    title: "Longest Valid Parentheses",
    topic: "Strings",
    difficulty: "Hard",
    description: "Find longest valid parentheses",
    examples: [{ input: 's = "(()"', output: "2", explanation: 'The longest valid parentheses substring is "()"' }],
    constraints: ["0 <= s.length <= 3 * 10^4"],
    starterCode: { cpp: cppStub("int longestValidParentheses(string s)") },
  },
  {
    slug: "minimum-window-substring",
    title: "Minimum Window Substring",
    topic: "Strings",
    difficulty: "Hard",
    description: "Find minimum window substring",
    examples: [{ input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' }],
    constraints: ["1 <= s.length, t.length <= 10^5"],
    starterCode: { cpp: cppStub("string minWindow(string s, string t)") },
  },
];
