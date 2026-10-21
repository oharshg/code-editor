import { CodeSnippetsProps } from "@/components/EditorComponent";

export const languageOptions = [
  {
    language: "javascript",
    version: "24",
    aliases: ["node-javascript", "node-js", "javascript", "js"],
    runtime: "node",
  },
  {
    language: "typescript",
    version: "2",
    aliases: ["ts", "node-ts", "tsc", "typescript5", "ts5"],
  },
  {
    language: "php",
    version: "8.5",
    aliases: [],
  },
  {
    language: "python",
    version: "3.14",
    aliases: ["py", "py3", "python3", "python3.10"],
  },
  {
    language: "ruby",
    version: "4.0",
    aliases: ["ruby3", "rb"],
  },
  {
    language: "rust",
    version: "1.93",
    aliases: ["rs"],
  },
  {
    language: "c++",
    version: "15",
    aliases: ["cpp", "g++"],
    runtime: "gcc",
  },
  {
    language: "go",
    version: "1.26",
    aliases: ["go", "golang"],
  },
  {
    language: "java",
    version: "25",
    aliases: [],
  },
  {
    language: "c",
    version: "15",
    aliases: ["gcc"],
    runtime: "gcc",
  },
];

export const codeSnippets: CodeSnippetsProps = {
  javascript: `
function add(a, b) {
  return a + b;
}
console.log(add(3, 4));`, // Output: 7

  typescript: `
function add(a: number, b: number): number {
  return a + b;
}
console.log(add(3, 4));`, // Output: 7

  php: `
<?php  
$x=3;  
$y=4;  
$z=$x+$y;  
echo $z;  
?>  `, // Output: 7

  python: `
def add(a, b):
  return a + b
print(add(3, 4))`, // Output: 7

  ruby: `
def add(a, b)
  a + b
end
puts add(3, 4)`, // Output: 7

  rust: `
fn add(a: i32, b: i32) -> i32 {
  a + b
}
fn main() {
  println!("{}", add(3, 4));
}`, // Output: 7

  "c++": `
#include <iostream>

int add(int a, int b) {
  return a + b;
}
int main() {
  std::cout << add(3, 4);
  return 0;
}`, // Output: 7

  go: `
package main
import "fmt"
func add(a, b int) int {
  return a + b
}
func main() {
  fmt.Println(add(3, 4))
}`, // Output: 7

  java: `
public class Main {
  public static int add(int a, int b) {
    return a + b;
  }
  public static void main(String[] args) {
    System.out.println(add(3, 4));
  }
}`, // Output: 7

  c: `
int add(int a, int b) {
  return a + b;
}
int main() {
  printf("%d", add(3, 4));
  return 0;
}`, // Output: 7
};
