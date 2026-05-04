#include<iostream>
#include<vector>
using namespace std;
int largestNum(vector<int> &arr){
  int largest=arr[0];
  for(int i=1;i<arr.size();i++){
    if(arr[i]>largest){
      largest=arr[i];
    }

  }
  return largest;
}

int main(){
  vector<int> arr ={3,6,8,9,2};
  int result = largestNum(arr);
  cout<<"largest element of array is="<<result;
  return 0;

}