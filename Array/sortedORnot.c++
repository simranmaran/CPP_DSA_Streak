#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    bool isSorted(vector<int>& a) {
        for(int i = 1; i < a.size(); i++) {
            if(a[i] < a[i-1]) {
                return false;
            }
        }
        return true;
    }
};

int main() {
    Solution ob;

    vector<int> arr = {10, 20, 30, 40, 50};

    if(ob.isSorted(arr)) {
        cout << "True";
    } else {
        cout << "False";
    }

    return 0;
}



