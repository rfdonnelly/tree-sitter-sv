module.exports = grammar({
  name: 'sv',

  rules: {
    // A.1. Source text

    // A.1.2 SystemVerilog source text
    source_text: $ => seq(
      optional($.timeunits_declaration),
      repeat($._description)
    ),

    _description: $ => choice(
      // FIXME
      // $.module_declaration,
      // $.udp_declaration,
      // $.interface_declaration,
      // $.program_declaration,
      $.package_declaration,
      seq(repeat($.attribute_instance), $.package_item)
      // FIXME
      // seq(repeat($.attribute_instance), $.bind_directive)
      // $.config_declaration,
    ),

    package_declaration: $ => seq(
      repeat($.attribute_instance),
      'package',
      optional($.lifetime),
      $.package_identifier, ';',
      optional($.timeunits_declaration),
      repeat(seq(repeat($.attribute_instance), $.package_item)),
      'endpackage',
      optional(seq(':', $.package_identifier))
    ),

    timeunits_declaration: $ => choice(
      seq('timeunit', $.time_literal, optional(seq('/', $.time_literal)), ';'),
      seq('timeprecision', $.time_literal, ';'),
      seq('timeunit', $.time_literal, ';', 'timeprecision', $.time_literal, ';'),
      seq('timeprecision', $.time_literal, ';', 'timeunit', $.time_literal, ';')
    ),

    // A.1.3 Module parameters and ports
    port_direction: $ => choice(
      'input',
      'output',
      'inout',
      'ref'
    ),

    // A.1.11 Package items
    package_item: $ => choice(
      $._package_or_generate_item_declaration
      // FIXME
      // $.anonymous_program,
      // $.package_export_declaration,
      // $.timeunits_declaration
    ),

    _package_or_generate_item_declaration: $=> choice(
      // FIXME
      // $.net_declaration,
      $.data_declaration,
      // FIXME
      // $.task_declaration,
      $.function_declaration,
      // FIXME
      // $.checker_declaration,
      // $.dpi_import_export,
      // $.extern_constraint_declaration,
      // $.class_declaration,
      // $.class_constructor_declaration,
      seq($.local_parameter_declaration, ';'),
      seq($.parameter_declaration, ';'),
      // $.covergroup_declaration,
      // $.assertion_item_declaration,
      ';'
    ),

    // A.2 Declarations

    // A.2.1 Declaration types

    // A.2.1.1 Module parameter declarations
    local_parameter_declaration: $ => choice(
      seq('localparam', $.data_type_or_implicit, $.list_of_param_assignments),
      seq('localparam', 'type', $.list_of_type_assignments)
    ),

    parameter_declaration: $ => choice(
      seq('parameter', $.data_type_or_implicit, $.list_of_param_assignments),
      seq('parameter', 'type', $.list_of_type_assignments)
    ),

    // A.2.1.3 Type declarations
    data_declaration: $ => choice(
      seq(
        optional('const'),
        optional('var'),
        optional($.lifetime),
        $.data_type_or_implicit,
        $.list_of_variable_decl_assignments,
        ';'
      )
      // FIXME
      // $.type_declaration,
      // $.package_import_declaration,
      // $.net_type_declaration
    ),

    lifetime: $ => choice(
      'static',
      'automaitc'
    ),

    // A.2.2 Declaration data types

    // A.2.2.1 Net and variable types
    data_type: $ => choice(
      // FIXME
      // seq(
      //   $.integer_vector_type,
      //   optional($.signing),
      //   repeat($.packed_dimension)
      // ),
      seq(
        $.integer_atom_type,
        optional($.signing)
      )
      // FIXME
      // $.non_integer_type,
      // seq(
      //   $.struct_union,
      //   optional(seq('packed', optional($.signing))),
      //   '{', $.struct_union_member, repeat($.struct_union_member), '}',
      //   repeat($.packed_dimension)
      // ),
      // seq(
      //   'enum',
      //   optional($.enum_base_type),
      //   '{', $.enum_name_declaration, repeat(seq(',', $.enum_name_declaration)), '}',
      //   repeat($.packed_dimension)
      // ),
      // 'string',
      // 'chandle',
      // seq(
      //   'virtual',
      //   optional('interface'),
      //   $.interface_identifier,
      //   optional($.parameter_value_assignment),
      //   optional(seq('.'), $.modport_identifier)
      // ),
      // seq(
      //   optional(choice($.class_scope, $.package_scope)),
      //   $.type_identifier,
      //   repeat($.packed_dimension)
      // ),
      // $.class_type,
      // 'event',
      // $.ps_covergroup_identifier,
      // $.type_reference
    ),

    data_type_or_implicit: $ => choice(
      $.data_type,
      $.implicit_data_type
    ),

    // FIXME: The implicit_data_type rule introduces ambiguity to the grammar.
    // Need to determine most optimal way to resolve.
    // implicit_data_type: $ => 'implicit_data_type',
    // NOTE: Refactored to prevent matching empty string
    implicit_data_type: $ => prec.left(choice(
      seq(
        $.signing,
        repeat($.packed_dimension)
      ),
      repeat1($.packed_dimension)
    )),
    // Direct implementation of the EBNF
    // implicit_data_type: $ => seq(
    //   optional($.signing),
    //   repeat($.packed_dimension)
    // ),

    data_type_or_void: $ => choice(
      $.data_type,
      'void'
    ),

    integer_atom_type: $ => choice(
      'byte',
      'shortint',
      'int',
      'longint',
      'integer',
      'time'
    ),

    signing: $ => choice(
      'signed',
      'unsigned'
    ),

    // A.2.3 Declaration lists
    list_of_param_assignments: $ => seq(
      $.param_assignment,
      repeat(seq(',', $.param_assignment))
    ),
    list_of_type_assignments: $ => seq(
      $.type_assignment,
      repeat(seq(',', $.type_assignment))
    ),
    list_of_variable_decl_assignments: $ => seq(
      $.variable_decl_assignment,
      repeat(seq(',', $.variable_decl_assignment))
    ),

    // A.2.4 Declaration assignments
    param_assignment: $ => seq(
      $.parameter_identifier,
      repeat($.unpacked_dimension),
      optional(seq('=', $.constant_param_expression))
    ),
    type_assignment: $ => seq(
      $.type_identifier,
      optional(seq('=', $.data_type))
    ),
    variable_decl_assignment: $ => choice(
      seq(
        $.variable_identifier,
        repeat($.variable_dimension),
        optional(seq('=', $.expression))
      ),
      // FIXME
      // seq(
      //   $.dynamic_array_variable_identifier,
      //   $.unsized_dimension,
      //   repeat($.variable_dimension),
      //   optional(seq('=', $.dynamic_array_new))
      // ),
      // seq(
      //   $.class_variable_identifier,
      //   optional(seq('=', $.class_new))
      // )
    ),

    // A.2.5 Declaration ranges
    unpacked_dimension: $ => choice(
      seq('[', $.constant_range, ']'),
      seq('[', $.constant_expression, ']')
    ),
    packed_dimension: $ => choice(
      seq('[', $.constant_range, ']'),
      $.unsized_dimension
    ),
    associative_dimension: $ => 'associative_dimension',
    variable_dimension: $ => choice(
      $.unsized_dimension,
      $.unpacked_dimension,
      $.associative_dimension,
      $.queue_dimension
    ),
    queue_dimension: $ => 'queue_dimension',
    unsized_dimension: $ => seq('[', ']'),

    // A.2.6 Function declarations
    function_data_type_or_implicit: $ => choice(
      $.data_type_or_void,
      $.implicit_data_type
    ),

    function_declaration: $ => seq(
      'function',
      optional($.lifetime),
      $._function_body_declaration
    ),

    _function_body_declaration: $ => choice(
      $.function_body_declaration_nonansi,
      $.function_body_declaration_ansi
    ),

    function_body_declaration_nonansi: $ => seq(
      $.function_data_type_or_implicit,
      // FIXME: Add A.2.6
      // optional(choice(
      //    seq($.interface_identifier, '.'),
      //    $.class_scope
      // )),
      $.function_identifier, ';',
      repeat($.tf_item_declaration),
      repeat($._function_statement_or_null),
      'endfunction', optional(seq(':', $.function_identifier))
    ),

    function_body_declaration_ansi: $ => seq(
      $.function_data_type_or_implicit,
      // FIXME: Add A.2.6
      // optional(choice(
      //    seq($.interface_identifier, '.'),
      //    $.class_scope
      // )),
      $.function_identifier, '(', optional($.tf_port_list), ')', ';',
      repeat($.block_item_declaration),
      repeat($._function_statement_or_null),
      'endfunction', optional(seq(':', $.function_identifier))
    ),

    // A.2.7 Task declarations
    tf_item_declaration: $ => choice(
      $.block_item_declaration,
      $.tf_port_declaration
    ),

    tf_port_list: $ => seq(
      $.tf_port_item,
      repeat(seq(',', $.tf_port_item))
    ),

    tf_port_item: $ => prec.left(seq(
      repeat($.attribute_instance),
      optional($.tf_port_direction),
      optional('var'),
      $.data_type_or_implicit,
      optional(seq(
        $.port_identifier,
        repeat($.variable_dimension),
        optional(seq('=', $.expression))
      ))
    )),

    tf_port_direction: $ => choice(
      $.port_direction,
      'const ref'
    ),

    // FIXME
    tf_port_declaration: $ => 'tf_port_declaration',

    // A.2.8 Block item declarations
    // FIXME
    block_item_declaration: $ => 'block_item_declaration',

    // A.6 Behavioral statements

    // A.6.4
    statement: $ => seq(
      optional(seq($.block_identifier, ':')),
      repeat($.attribute_instance),
      $._statement_item
    ),

    _statement_item: $ => choice(
      // FIXME
      // seq($.blocking_assignment, ';'),
      // seq($.nonblocking_assignment, ';'),
      // seq($.procedural_continuous_assignment, ';'),
      // $.case_statement,
      // $.conditional_statement,
      // seq($.inc_or_dec_expression, ';'),
      // $.subroutine_call_statement,
      // $.disable_statement,
      // $.event_trigger,
      // $.loop_statement,
      $.jump_statement,
      // FIXME
      // $.par_block,
      // $.procedural_timing_control_statement,
      // $.seq_block,
      // $.wait_statement,
      // $.procedural_assertion_statement,
      // seq($.clocking_drive, ';'),
      // $.randsequence_statement,
      // $.randcase_statement,
      // $.exact_property_statement
    ),

    _function_statement: $ => $.statement,

    _function_statement_or_null: $ => choice(
      $._function_statement,
      seq(repeat($.attribute_instance), ';')
    ),

    // A.6.5 Timing control statements
    jump_statement: $ => choice(
      seq('return', optional($.expression), ';'),
      seq('break', ';'),
      seq('continue', ';')
    ),

    // A.8.3 Expressions
    // FIXME
    constant_expression: $ => 'constant_expression',
    // constant_expression: $ => choice(
    //   $.constant_primary,
    //   seq(
    //     $.unary_operator,
    //     repeat($.attribute_instance),
    //     $.constant_primary
    //   ),
    //   seq(
    //     $.constant_expression,
    //     $.binary_operator,
    //     repeat($.attribute_instance),
    //     $.constant_expression
    //   ),
    //   seq(
    //     $.constant_expression,
    //     '?',
    //     repeat($.attribute_instance),
    //     $.constant_expression,
    //     ':',
    //     $.constant_expression
    //   )
    // ),
    // FIXME
    constant_param_expression: $ => 'constant_param_expression',
    constant_range: $ => seq(
      $.constant_expression, ':', $.constant_expression
    ),
    // FIXME
    expression: $ => 'expression',

    // A.8.4 Primaries
    time_literal: $ => '1ns', // FIXME

    // A.9 General

    // A.9.1 Attributes
    attribute_instance: $ => seq(
      '(*',
      $.attr_spec,
      repeat(seq(',', $.attr_spec)),
      '*)'
    ),
    attr_spec: $ => seq(
      $.attr_name,
      optional(seq('=', $.constant_expression))
    ),
    attr_name: $ => $._identifier,

    // A.9.3 Identifiers
    block_identifier: $ => $._identifier,
    // FIXME
    escaped_identifier: $ => 'escaped_identifier',
    function_identifier: $ => $._identifier,
    _identifier: $ => choice(
      $.simple_identifier,
      $.escaped_identifier
    ),
    parameter_identifier: $ => $._identifier,
    package_identifier: $ => $._identifier,
    port_identifier: $ => $._identifier,
    simple_identifier: $ => /[a-zA-Z_][a-zA-Z0-9_$]*/,
    type_identifier: $ => $._identifier,
    variable_identifier: $ => $._identifier,
  },

  inline: $ => [
    $.block_identifier,
    $.function_identifier,
    $.parameter_identifier,
    $.package_identifier,
    $.port_identifier,
    $.type_identifier,
    $.variable_identifier
  ],

  conflicts: $ => [
    [$.data_type]
  ]

});
