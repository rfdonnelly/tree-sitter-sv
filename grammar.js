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
      // seq($.local_param_declaration, ';'),
      // seq($.param_declaration, ';'),
      // $.covergroup_declaration,
      // $.assertion_item_declaration,
      ';'
    ),

    // A.2 Declarations

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

    // A.2.3 Declaration lists
    list_of_variable_decl_assignments: $ => seq(
      $.variable_decl_assignment,
      repeat(seq(',', $.variable_decl_assignment))
    ),

    // A.2.4 Declaration assignments
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

    time_literal: $ => seq('1ns'), // FIXME

    function_declaration: $ => seq(
      'function', optional($.lifetime), $._function_body_declaration
    ),

    lifetime: $ => choice(
      'static',
      'automaitc'
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
      $.function_identifier, '(', repeat($.tf_port_list), ')', ';',
      repeat($.block_item_declaration),
      repeat($._function_statement_or_null),
      'endfunction', optional(seq(':', $.function_identifier))
    ),

    _function_statement_or_null: $ => choice(
      $._function_statement,
      seq(repeat($.attribute_instance), ';')
    ),

    _function_statement: $ => $.statement,

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

    jump_statement: $ => choice(
      seq('return', optional($.expression), ';'),
      seq('break', ';'),
      seq('continue', ';')
    ),

    tf_item_declaration: $ => choice(
      $.block_item_declaration,
      $.tf_port_declaration
    ),

    tf_port_list: $ => seq(
      $.tf_port_item,
      repeat(seq(',', $.tf_port_item))
    ),

    tf_port_item: $ => seq(
      repeat($.attribute_instance),
      optional($.tf_port_direction),
      optional('var'),
      $.data_type_or_implicit,
      optional(seq(
        $.port_identifier,
        repeat($.variable_dimension),
        optional(seq('=', $.expression))
      ))
    ),

    // FIXME
    block_item_declaration: $ => 'block_item_declaration',
    tf_port_declaration: $ => 'tf_port_declaration',
    implicit_data_type: $ => 'implicit_data_type',
    escaped_identifier: $ => 'escaped_identifier',
    unpacked_dimension: $ => 'unpacked_dimension',
    associative_dimension: $ => 'associative_dimension',
    queue_dimension: $ => 'queue_dimension',
    expression: $ => 'expression',

    variable_dimension: $ => choice(
      $.unsized_dimension,
      $.unpacked_dimension,
      $.associative_dimension,
      $.queue_dimension
    ),

    unsized_dimension: $ => seq('[', ']'),

    // A.9.3 Identifiers
    block_identifier: $ => $.identifier,
    function_identifier: $ => $.identifier,
    identifier: $ => choice(
      $.simple_identifier,
      $.escaped_identifier
    ),
    package_identifier: $ => $.identifier,
    port_identifier: $ => $.identifier,
    simple_identifier: $ => /[a-zA-Z_][a-zA-Z0-9_$]*/,
    variable_identifier: $ => $.identifier,

    function_data_type_or_implicit: $ => choice(
      $.data_type_or_void,
      $.implicit_data_type
    ),

    tf_port_direction: $ => choice(
      $.port_direction,
      'const ref'
    ),

    port_direction: $ => choice(
      'input',
      'output',
      'inout',
      'ref'
    ),

    data_type_or_implicit: $ => choice(
      $.data_type,
      $.implicit_data_type
    ),

    data_type_or_void: $ => choice(
      $.data_type,
      'void'
    ),

    // FIXME: complete
    data_type: $ => choice(
      seq($.integer_atom_type, optional($.signing))
    ),

    signing: $ => choice(
      'signed',
      'unsigned'
    ),

    integer_atom_type: $ => choice(
      'byte',
      'shortint',
      'int',
      'longint',
      'integer',
      'time'
    ),

    attribute_instance: $ => seq('(* *)')
  },

  inline: $ => [
  ]

});
