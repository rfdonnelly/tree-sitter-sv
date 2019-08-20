# tree-sitter-sv

A SystemVerilog grammar for [Tree-sitter].

This is an effort to improve on [tree-sitter-verilog].  Tree-sitter-verilog
takes a long time (55s) to generate a very large parser (54MB parser.c), has
minimal test coverage (54 tests), and generates unnecessarily deep trees.

The goal is to build a working parser from the ground up that improves on
tree-sitter-verilog then feed the improvements back into tree-sitter-verilog.

[Tree-sitter]: https://github.com/tree-sitter/tree-sitter
[tree-sitter-verilog]: https://github.com/tree-sitter/tree-sitter-verilog
